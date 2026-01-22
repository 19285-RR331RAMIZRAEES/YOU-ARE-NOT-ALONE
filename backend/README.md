# StoryShare Backend API

FastAPI backend for the StoryShare platform with **SQLite database** for persistent storage.

## Features

- ✅ **SQLite Database** - Stories are permanently saved to `stories.db`
- ✅ RESTful API with FastAPI
- ✅ CORS enabled for frontend communication
- ✅ Automatic database initialization
- ✅ Sample data included

## Database

**Type:** SQLite (file-based database)  
**File:** `stories.db` (created automatically in the backend folder)

### Database Schema

```sql
CREATE TABLE stories (
    id TEXT PRIMARY KEY,
    content TEXT NOT NULL,
    author TEXT NOT NULL,
    date TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)
```

**Why SQLite?**
- ✅ No separate database server needed
- ✅ Data persists even after restart
- ✅ Easy to use and lightweight
- ✅ Perfect for development and small applications
- ✅ Can be upgraded to PostgreSQL/MySQL later if needed

## Setup

1. **Install Python dependencies:**
   ```bash
   cd backend
   pip install -r requirements.txt
   ```

2. **Run the development server:**
   ```bash
   python main.py
   ```
   
   Or using uvicorn directly:
   ```bash
   uvicorn main:app --reload --port 8000
   ```

3. **API will be available at:**
   - API: http://localhost:8000
   - Interactive docs: http://localhost:8000/docs
   - Alternative docs: http://localhost:8000/redoc

## API Endpoints

### GET /api/stories
Returns all stories ordered by date (newest first).

**Response:**
```json
[
  {
    "id": "uuid",
    "content": "Story text...",
    "author": "Anonymous",
    "date": "2026-01-15"
  }
]
```

### POST /api/stories
Create a new story.

**Request Body:**
```json
{
  "content": "Your story here...",
  "isAnonymous": true
}
```

**Response:**
```json
{
  "id": "uuid",
  "content": "Your story here...",
  "author": "Anonymous",
  "date": "2026-01-15"
}
```

### GET /api/health
Health check endpoint.

## Development

- Stories are stored in-memory (will reset when server restarts)
- For production, replace with a proper database (PostgreSQL, MongoDB, etc.)
- CORS is configured to accept requests from http://localhost:3000
