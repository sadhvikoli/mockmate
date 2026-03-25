# MockMate 🎯

An AI-powered mock interview platform that helps developers practice technical interviews and get instant feedback.

## Features

- 🔐 JWT-based authentication (register, login)
- 🤖 AI-generated interview questions powered by Gemini API
- 📝 Real-time answer submission and AI feedback
- 📊 Performance scoring across sessions
- ⚡ Redis caching for fast question delivery
- 🐘 PostgreSQL for persistent session storage

## Tech Stack

**Backend**
- FastAPI (Python) — REST API
- PostgreSQL — primary database
- Redis — question caching layer
- SQLAlchemy — async ORM
- JWT + bcrypt — authentication
- Google Gemini — AI question generation and feedback

**Frontend**
- React + Vite
- Tailwind CSS
- Axios

## Getting Started

### Prerequisites
- Python 3.11+
- Node.js 18+
- PostgreSQL
- Redis

### Backend Setup
```bash
cd backend
cp .env.example .env  # add your keys
uv run uvicorn app.main:app --reload
```

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

### Environment Variables
```
DATABASE_URL=postgresql+asyncpg://localhost/mockmate
REDIS_URL=redis://localhost:6379
SECRET_KEY=your-secret-key
GEMINI_API_KEY=your-gemini-api-key
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login and get JWT token |
| POST | `/api/interview/start` | Start a session, generates AI questions |
| GET  | `/api/interview/sessions` | Get all past sessions |
| GET  | `/api/interview/sessions/{id}` | Get session detail and feedback |
| POST | `/api/interview/sessions/{id}/answer` | Submit an answer |
| POST | `/api/interview/sessions/{id}/complete` | Complete session, trigger AI feedback |

## How It Works

1. User registers and logs in — receives a JWT token
2. User starts a mock interview for a specific role and difficulty
3. Gemini AI generates 5 tailored interview questions
4. User submits answers one by one
5. User completes the session — Gemini evaluates each answer in the background
6. User receives a score out of 10 with strengths, improvements, and ideal answers

## Project Structure
```
mockmate/
├── backend/
│   ├── app/
│   │   ├── api/routes/    # auth and interview endpoints
│   │   ├── core/          # config, security, JWT
│   │   ├── db/            # database setup and init
│   │   ├── models/        # PostgreSQL table definitions
│   │   ├── schemas/       # request and response shapes
│   │   └── services/      # AI, caching, interview logic
│   └── main.py
└── frontend/
    └── src/
```

## Status

✅ Week 1 — Backend, auth, database complete  
✅ Week 2 — AI integration, Redis caching complete  
✅ Week 3 — React frontend complete  
🚧 Week 4 — Docker, CI/CD, deployment in progress
