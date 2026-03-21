# MockMate 🎯

An AI-powered mock interview platform that helps developers practice technical interviews and get instant feedback.

## Features

- 🔐 JWT-based authentication (register, login)
- 🤖 AI-generated interview questions powered by Claude API
- 📝 Real-time answer submission and feedback
- 📊 Performance tracking across sessions
- ⚡ Redis caching for fast question delivery
- 🐳 Dockerized for easy deployment

## Tech Stack

**Backend**
- FastAPI (Python) — REST API
- PostgreSQL — primary database
- Redis — caching layer
- SQLAlchemy — ORM
- JWT + bcrypt — authentication

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
uv install
cp .env.example .env  # add your keys
uv run uvicorn app.main:app --reload
```

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login and get JWT token |
| POST | `/api/interview/start` | Start a mock interview |
| POST | `/api/interview/answer` | Submit an answer |
| GET  | `/api/interview/sessions` | Get session history |

## Project Structure
```
mockmate/
├── backend/
│   ├── app/
│   │   ├── api/routes/    # API endpoints
│   │   ├── core/          # config, security
│   │   ├── db/            # database setup
│   │   ├── models/        # database tables
│   │   ├── schemas/       # request/response shapes
│   │   └── services/      # business logic
│   └── main.py
└── frontend/
    └── src/
```

## Status

🚧 In active development — Week 1 of 4