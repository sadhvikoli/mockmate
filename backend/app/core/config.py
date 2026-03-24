from pydantic_settings import BaseSettings
from typing import Optional

class Settings(BaseSettings):
    APP_NAME: str = "MockMate"
    DEBUG: bool = True
    
    DATABASE_URL: str
    REDIS_URL: str = "redis://localhost:6379"
    
    SECRET_KEY: str
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    
    ANTHROPIC_API_KEY: str

    GEMINI_API_KEY: str = "AIzaSyAthSqcIFVQHY18AumXxD1kXggrDz_9wfo"

    class Config:
        env_file = ".env"

settings = Settings()