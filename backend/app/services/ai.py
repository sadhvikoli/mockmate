import json
import asyncio
from google import genai
from google.genai.errors import ClientError
from app.core.config import settings

client = genai.Client(api_key=settings.GEMINI_API_KEY)

# limit concurrent AI calls
semaphore = asyncio.Semaphore(3)


def clean_json(text: str):
    text = text.strip()

    if text.startswith("```"):
        text = text.split("```")[1]

        if text.startswith("json"):
            text = text[4:]

    return text.strip()


async def call_gemini(prompt: str):

    async with semaphore:

        for attempt in range(3):

            try:

                response = await asyncio.wait_for(
                    asyncio.to_thread(
                        client.models.generate_content,
                        model="gemini-2.0-flash",
                        contents=prompt
                    ),
                    timeout=30
                )

                return response.text

            except ClientError as e:

                # retry on rate limit
                if e.status_code == 429:

                    wait_time = 60 * (attempt + 1)

                    print(
                        f"Rate limit hit. Retrying in {wait_time}s..."
                    )

                    await asyncio.sleep(wait_time)

                else:
                    raise

            except asyncio.TimeoutError:

                print("Gemini timeout. Retrying...")

        # fallback model
        response = await asyncio.to_thread(
            client.models.generate_content,
            model="gemini-1.5-flash",
            contents=prompt
        )

        return response.text


async def generate_questions(
    role: str,
    difficulty: str,
    num_questions: int = 5
) -> list[str]:

    prompt = f"""
Generate {num_questions} technical interview questions
for a {role} position.

Difficulty level: {difficulty}

Rules:
- Mix of coding concepts
- System design
- Behavioral questions
- Clear and specific
- Match difficulty

Respond with ONLY a JSON array of strings.
"""

    try:

        text = await call_gemini(prompt)

        return json.loads(clean_json(text))

    except Exception:

        # safe fallback
        return [
            "Explain a challenging project you worked on.",
            "What is a REST API?",
            "Describe time complexity.",
            "Explain a bug you fixed.",
            "How do you debug code?"
        ]


async def generate_feedback(
    role: str,
    question: str,
    answer: str
) -> dict:

    prompt = f"""
You are an experienced technical interviewer
for a {role} position.

Question:
{question}

Candidate answer:
{answer}

Respond with ONLY JSON:

{{
    "score": 1-10,
    "strengths": "...",
    "improvements": "...",
    "ideal_answer": "..."
}}
"""

    try:

        text = await call_gemini(prompt)

        return json.loads(clean_json(text))

    except Exception:

        return {
            "score": 5,
            "strengths": "Basic understanding shown",
            "improvements": "Provide more structured explanation",
            "ideal_answer": "Explain concept clearly with example"
        }