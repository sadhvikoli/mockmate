import json
import asyncio
from google import genai
from app.core.config import settings

client = genai.Client(api_key=settings.GEMINI_API_KEY)

def clean_json(text: str):
    text = text.strip()
    if text.startswith("```"):
        text = text.split("```")[1]
        if text.startswith("json"):
            text = text[4:]
    return text.strip()

async def generate_questions(role: str, difficulty: str, num_questions: int = 5) -> list[str]:
    prompt = f"""Generate {num_questions} technical interview questions for a {role} position.
Difficulty level: {difficulty}

Rules:
- Mix of coding concepts, system design, and behavioral questions
- Each question should be clear and specific
- Appropriate for the difficulty level

Respond with ONLY a JSON array of strings."""

    response = await asyncio.to_thread(
        client.models.generate_content,
        model="gemini-2.0-flash",
        contents=prompt
    )

    try:
        return json.loads(clean_json(response.text))
    except Exception:
        return [
            "Explain a challenging project you worked on.",
            "What is a REST API?",
            "Describe time complexity.",
            "Explain a bug you fixed.",
            "How do you debug code?"
        ]

async def generate_feedback(role: str, question: str, answer: str) -> dict:
    prompt = f"""You are an experienced technical interviewer for a {role} position.

Question asked: {question}
Candidate's answer: {answer}

Respond with ONLY a JSON object:
{{
    "score": number from 1 to 10,
    "strengths": "what they did well",
    "improvements": "what could be better",
    "ideal_answer": "brief ideal answer"
}}"""

    response = await asyncio.to_thread(
        client.models.generate_content,
        model="gemini-2.0-flash",
        contents=prompt
    )

    try:
        return json.loads(clean_json(response.text))
    except Exception:
        return {
            "score": 5,
            "strengths": "Basic understanding shown",
            "improvements": "Provide more structured explanation",
            "ideal_answer": "Explain concept clearly with example"
        }