from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.models.session import InterviewSession
from app.schemas.session import SessionCreate
from uuid import UUID
from app.services.ai import generate_questions, generate_feedback
from app.services.cache import get_cached_questions, cache_questions


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


async def get_or_generate_questions(role: str, difficulty: str) -> list[str]:
    cached = await get_cached_questions(role, difficulty)
    if cached:
        print(f"Cache HIT: questions:{role}:{difficulty}")
        return cached

    print(f"Cache MISS: generating for questions:{role}:{difficulty}")
    questions = await generate_questions(role, difficulty)
    
    if questions:
        await cache_questions(role, difficulty, questions)
        print(f"Cached: questions:{role}:{difficulty}")
        return questions
    else:
        print("Gemini unavailable — returning fallback, not caching")
        return [
            "Explain a challenging project you worked on.",
            "What is a REST API?",
            "Describe time complexity.",
            "Explain a bug you fixed.",
            "How do you debug code?"
        ]

async def process_feedback(db: AsyncSession, session: InterviewSession) -> None:
    if not session.questions or not session.answers:
        return

    feedbacks = []
    for answer_data in session.answers:
        idx = answer_data.get("question_index", 0)
        if idx < len(session.questions):
            feedback = await generate_feedback(
                session.role,
                session.questions[idx],
                answer_data.get("answer", "")
            )
            if feedback:
                feedbacks.append(feedback)
            else:
                feedbacks.append({
                    "score": 0,
                    "strengths": "Could not evaluate — AI unavailable",
                    "improvements": "Please retry this session",
                    "ideal_answer": "N/A"
                })

    valid_scores = [f.get("score", 0) for f in feedbacks if f.get("score", 0) > 0]
    avg_score = int(sum(valid_scores) / len(valid_scores)) if valid_scores else 0

    session.feedback = feedbacks
    session.score = avg_score
    session.status = "completed"
    await db.commit()