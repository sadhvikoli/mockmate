from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.models.session import InterviewSession
from app.schemas.session import SessionCreate
from uuid import UUID

async def create_session(db: AsyncSession, user_id: UUID, data: SessionCreate) -> InterviewSession:
    session = InterviewSession(
        user_id=user_id,
        role=data.role,
        difficulty=data.difficulty,
        questions=[],
        answers=[],
        feedback=[],
        status="in_progress"
    )
    db.add(session)
    await db.commit()
    await db.refresh(session)
    return session

async def get_user_sessions(db: AsyncSession, user_id: UUID):
    result = await db.execute(
        select(InterviewSession)
        .where(InterviewSession.user_id == user_id)
        .order_by(InterviewSession.created_at.desc())
    )
    return result.scalars().all()

async def get_session(db: AsyncSession, session_id: UUID, user_id: UUID):
    result = await db.execute(
        select(InterviewSession)
        .where(InterviewSession.id == session_id)
        .where(InterviewSession.user_id == user_id)
    )
    return result.scalar_one_or_none()