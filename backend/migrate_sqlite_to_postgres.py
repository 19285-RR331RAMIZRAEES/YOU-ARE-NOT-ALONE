"""
Migration script to move data from SQLite to PostgreSQL
Run this after setting up PostgreSQL with Docker
"""

import sqlite3
import psycopg2
from datetime import datetime

# SQLite configuration
SQLITE_DB = "stories.db"

# PostgreSQL configuration
PG_CONFIG = {
    "host": "localhost",
    "port": 5432,
    "database": "stories_db",
    "user": "storyshare",
    "password": "hopestories2026"
}

def migrate_stories():
    """Migrate stories from SQLite to PostgreSQL"""
    
    # Connect to SQLite
    sqlite_conn = sqlite3.connect(SQLITE_DB)
    sqlite_conn.row_factory = sqlite3.Row
    sqlite_cursor = sqlite_conn.cursor()
    
    # Connect to PostgreSQL
    pg_conn = psycopg2.connect(**PG_CONFIG)
    pg_cursor = pg_conn.cursor()
    
    try:
        # Get all stories from SQLite
        sqlite_cursor.execute("SELECT * FROM stories ORDER BY date")
        stories = sqlite_cursor.fetchall()
        
        print(f"Found {len(stories)} stories in SQLite database")
        
        # Clear existing stories in PostgreSQL (optional)
        pg_cursor.execute("DELETE FROM stories")
        print("Cleared PostgreSQL stories table")
        
        # Insert into PostgreSQL
        migrated = 0
        for story in stories:
            # Determine if anonymous
            is_anonymous = story['author'].lower() == 'anonymous'
            author_name = None if is_anonymous else story['author']
            
            # Parse date
            try:
                created_at = datetime.strptime(story['date'], "%Y-%m-%d")
            except:
                created_at = datetime.now()
            
            # Insert into PostgreSQL
            pg_cursor.execute("""
                INSERT INTO stories (content, is_anonymous, author_name, created_at, is_approved)
                VALUES (%s, %s, %s, %s, %s)
            """, (
                story['content'],
                is_anonymous,
                author_name,
                created_at,
                True  # Auto-approve migrated stories
            ))
            
            migrated += 1
        
        # Commit changes
        pg_conn.commit()
        print(f"✅ Successfully migrated {migrated} stories to PostgreSQL!")
        
    except Exception as e:
        print(f"❌ Error during migration: {e}")
        pg_conn.rollback()
    
    finally:
        # Close connections
        sqlite_cursor.close()
        sqlite_conn.close()
        pg_cursor.close()
        pg_conn.close()

if __name__ == "__main__":
    print("🔄 Starting migration from SQLite to PostgreSQL...")
    migrate_stories()
    print("✅ Migration complete!")
