from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.database import get_db
from app.api.deps import get_current_user
from app.models.user import User
from app.schemas.session import SessionCreate, SessionResponse, AnswerSubmit
from app.services.interview import create_session, get_user_sessions, get_session, get_or_generate_questions, process_feedback
from uuid import UUID

router = APIRouter(prefix="/interview", tags=["interview"])

@router.post("/start", response_model=SessionResponse)
async def start_interview(
    data: SessionCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    session = await create_session(db, current_user.id, data)
    questions = await get_or_generate_questions(data.role, data.difficulty)
    session.questions = questions
    await db.commit()
    await db.refresh(session)
    return session

@router.get("/sessions", response_model=list[SessionResponse])
async def list_sessions(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    return await get_user_sessions(db, current_user.id)

@router.get("/sessions/{session_id}", response_model=SessionResponse)
async def get_session_detail(
    session_id: UUID,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    session = await get_session(db, session_id, current_user.id)
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
    return session

@router.post("/sessions/{session_id}/answer")
async def submit_answer(
    session_id: UUID,
    answer_data: AnswerSubmit,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    session = await get_session(db, session_id, current_user.id)
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
    
    answers = list(session.answers or [])
    answers.append({
        "question_index": answer_data.question_index,
        "answer": answer_data.answer
    })
    session.answers = answers
    await db.commit()
    return {"message": "Answer saved"}

@router.post("/sessions/{session_id}/complete")
async def complete_session(
    session_id: UUID,
    background_tasks: BackgroundTasks,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    session = await get_session(db, session_id, current_user.id)
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
    if session.status == "completed":
        raise HTTPException(status_code=400, detail="Session already completed")
    
    background_tasks.add_task(process_feedback, db, session)
    return {"message": "Session completing, feedback being generated"}