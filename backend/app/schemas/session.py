from pydantic import BaseModel
from uuid import UUID
from datetime import datetime
from typing import Optional, List, Any

class SessionCreate(BaseModel):
    role: str
    difficulty: str = "medium"

class SessionResponse(BaseModel):
    id: UUID
    role: str
    difficulty: str
    questions: List[str]
    feedback: List[Any] = []
    score: Optional[int]
    status: str
    created_at: datetime

    class Config:
        from_attributes = True

class AnswerSubmit(BaseModel):
    question_index: int
    answer: str