from app.db.database import engine
from app.db.base import Base
from app.models import user, session

async def init_db():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)