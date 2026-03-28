import redis.asyncio as redis
import json
from app.core.config import settings

redis_client = redis.from_url(settings.REDIS_URL)

async def get_cached_questions(role: str, difficulty: str) -> list | None:
    try:
        key = f"questions:{role}:{difficulty}"
        cached = await redis_client.get(key)
        if cached:
            return json.loads(cached)
        return None
    except Exception as e:
        print(f"Redis GET error: {e}")
        return None

async def cache_questions(role: str, difficulty: str, questions: list) -> None:
    try:
        key = f"questions:{role}:{difficulty}"
        await redis_client.setex(key, 3600, json.dumps(questions))
    except Exception as e:
        print(f"Redis SET error: {e}")