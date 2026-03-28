import json
import asyncio
from google import genai
from google.genai.errors import ClientError
from app.core.config import settings

client = genai.Client(api_key=settings.GEMINI_API_KEY)

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
                error_str = str(e)
                if '429' in error_str:
                    wait_time = 60 * (attempt + 1)
                    print(f"Rate limit hit. Retrying in {wait_time}s...")
                    await asyncio.sleep(wait_time)
                else:
                    raise

            except asyncio.TimeoutError:
                print("Gemini timeout. Retrying...")

        response = await asyncio.to_thread(
            client.models.generate_content,
            model="gemini-1.5-flash",
            contents=prompt
        )
        return response.text

async def generate_questions(role: str, difficulty: str, num_questions: int = 5) -> list[str] | None:
    prompt = f"""
Generate {num_questions} technical interview questions for a {role} position.
Difficulty level: {difficulty}
Rules:
- Mix of coding concepts, system design, and behavioral questions
- Questions must be specifically relevant to the {role} role
- Clear and specific
- Match the {difficulty} difficulty level
Respond with ONLY a JSON array of strings. No other text.
"""
    try:
        text = await call_gemini(prompt)
        return json.loads(clean_json(text))
    except Exception as e:
        print(f"Question generation failed: {e}")
        return None
async def generate_feedback(role: str, question: str, answer: str) -> dict | None:
    prompt = f"""
You are an experienced technical interviewer for a {role} position.

Question:
{question}

Candidate answer:
{answer}

Evaluate this answer honestly and respond with ONLY a JSON object:
{{
    "score": <integer from 1 to 10>,
    "strengths": "<what they did well>",
    "improvements": "<what could be better>",
    "ideal_answer": "<brief ideal answer>"
}}
"""
    try:
        text = await call_gemini(prompt)
        return json.loads(clean_json(text))
    except Exception as e:
        print(f"Feedback generation failed: {e}")
        return None