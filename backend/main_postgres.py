from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime
from sqlalchemy.orm import Session
from database import get_db, init_db, Story
import uuid

app = FastAPI(title="Hope Stories API", version="3.0.0")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://localhost:3001",
        "https://*.vercel.app",  # For Vercel deployment
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize database on startup
@app.on_event("startup")
def on_startup():
    init_db()

# Pydantic models
class StoryCreate(BaseModel):
    content: str = Field(..., min_length=10, max_length=10000)
    isAnonymous: bool = True
    authorName: Optional[str] = Field(None, max_length=50)

class StoryResponse(BaseModel):
    id: str
    content: str
    author: str
    date: str
    
    class Config:
        from_attributes = True

@app.get("/")
def read_root():
    return {
        "message": "Hope Stories API - You Are Not Alone",
        "version": "3.0.0",
        "database": "PostgreSQL"
    }

@app.get("/api/stories", response_model=List[StoryResponse])
def get_stories(db: Session = Depends(get_db)):
    """Get all approved stories, ordered by date (newest first)"""
    stories = db.query(Story).filter(
        Story.is_approved == True
    ).order_by(Story.created_at.desc()).all()
    
    # Transform to response format
    return [
        StoryResponse(
            id=str(story.id),
            content=story.content,
            author=story.author_name if story.author_name and not story.is_anonymous else "Anonymous",
            date=story.created_at.isoformat()
        )
        for story in stories
    ]

@app.post("/api/stories", response_model=StoryResponse)
def create_story(story_data: StoryCreate, db: Session = Depends(get_db)):
    """Create a new story"""
    if not story_data.content or len(story_data.content.strip()) < 10:
        raise HTTPException(
            status_code=400,
            detail="Story content must be at least 10 characters"
        )
    
    # Determine author info
    author_name = None
    if not story_data.isAnonymous and story_data.authorName:
        author_name = story_data.authorName.strip()[:50]
    
    # Create new story
    new_story = Story(
        content=story_data.content.strip(),
        is_anonymous=story_data.isAnonymous,
        author_name=author_name,
        is_approved=True,  # Auto-approve for now
        is_flagged=False
    )
    
    db.add(new_story)
    db.commit()
    db.refresh(new_story)
    
    return StoryResponse(
        id=str(new_story.id),
        content=new_story.content,
        author=author_name if author_name and not story_data.isAnonymous else "Anonymous",
        date=new_story.created_at.isoformat()
    )

@app.delete("/api/stories/{story_id}")
def delete_story(story_id: str, db: Session = Depends(get_db)):
    """Delete a story by ID"""
    try:
        story_uuid = uuid.UUID(story_id)
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid story ID format")
    
    story = db.query(Story).filter(Story.id == story_uuid).first()
    
    if not story:
        raise HTTPException(status_code=404, detail="Story not found")
    
    db.delete(story)
    db.commit()
    
    return {"message": "Story deleted successfully", "id": story_id}

@app.get("/api/health")
def health_check(db: Session = Depends(get_db)):
    """Health check endpoint"""
    try:
        # Count total stories
        total_count = db.query(Story).count()
        approved_count = db.query(Story).filter(Story.is_approved == True).count()
        
        return {
            "status": "healthy",
            "database": "PostgreSQL",
            "total_stories": total_count,
            "approved_stories": approved_count,
            "timestamp": datetime.now().isoformat()
        }
    except Exception as e:
        return {
            "status": "unhealthy",
            "error": str(e),
            "timestamp": datetime.now().isoformat()
        }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
