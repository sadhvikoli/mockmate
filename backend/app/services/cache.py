import redis.asyncio as redis
import json
from app.core.config import settings

redis_client = redis.from_url(settings.REDIS_URL)

async def get_cached_questions(role: str, difficulty: str) -> list | None:
    key = f"questions:{role}:{difficulty}"
    cached = await redis_client.get(key)
    if cached:
        return json.loads(cached)
    return None

async def cache_questions(role: str, difficulty: str, questions: list) -> None:
    key = f"questions:{role}:{difficulty}"
    await redis_client.setex(key, 3600, json.dumps(questions))