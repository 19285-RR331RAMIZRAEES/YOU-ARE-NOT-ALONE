"use client";

import { useState, useEffect } from "react";
import axios from "axios";

interface Story {
  id: string;
  content: string;
  author: string;
  date: string;
}

export default function StoriesPage() {
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedStories, setExpandedStories] = useState<Set<string>>(new Set());

  const toggleStory = (storyId: string) => {
    setExpandedStories(prev => {
      const newSet = new Set(prev);
      if (newSet.has(storyId)) {
        newSet.delete(storyId);
      } else {
        newSet.add(storyId);
      }
      return newSet;
    });
  };

  useEffect(() => {
    fetchStories();
  }, []);

  const fetchStories = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get<Story[]>("http://localhost:8000/api/stories");
      setStories(response.data);
    } catch (err) {
      console.error("Error fetching stories:", err);
      setError("Failed to load stories. Make sure the backend server is running on port 8000.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (storyId: string) => {
    if (!window.confirm("Are you sure you want to delete this story? This action cannot be undone.")) {
      return;
    }

    try {
      await axios.delete(`http://localhost:8000/api/stories/${storyId}`);
      // Refresh the stories list
      fetchStories();
    } catch (err) {
      console.error("Error deleting story:", err);
      alert("Failed to delete story. Please try again.");
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 md:py-16">
      <div className="text-center mb-12 animate-fade-in">
        <h1 
          className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4"
          style={{ color: '#2E2A28', fontFamily: '"Playfair Display", "Georgia", serif' }}
        >
          Stories of Hope
        </h1>
        <p 
          className="text-lg max-w-xl mx-auto mb-6"
          style={{ color: '#5A524C', lineHeight: '1.7' }}
        >
          Real stories from people who faced darkness and chose to stay. Each one is proof that recovery is possible.
        </p>
        <div 
          className="w-16 h-0.5 rounded-full mx-auto"
          style={{ backgroundColor: '#8FB8A2' }}
        ></div>
      </div>

      {loading && (
        <div className="text-center py-12">
          <div 
            className="inline-block animate-spin rounded-full h-10 w-10 border-3"
            style={{ borderColor: '#C8DDD2', borderTopColor: '#8FB8A2' }}
          ></div>
          <p className="mt-4 text-base" style={{ color: '#7A6F68' }}>Loading stories...</p>
        </div>
      )}

      {error && (
        <div 
          className="rounded-2xl p-6 text-center mb-8"
          style={{ 
            backgroundColor: 'rgba(254, 242, 242, 0.8)',
            border: '1px solid rgba(252, 165, 165, 0.5)'
          }}
        >
          <p style={{ color: '#DC2626' }}>{error}</p>
          <button
            onClick={fetchStories}
            className="mt-4 px-6 py-2 text-white rounded-full transition-all duration-200"
            style={{ backgroundColor: '#8FB8A2' }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#7AAE96'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#8FB8A2'}
          >
            Try Again
          </button>
        </div>
      )}

      {!loading && !error && stories.length === 0 && (
        <div 
          className="text-center py-12 rounded-2xl p-8"
          style={{ 
            backgroundColor: 'rgba(255, 255, 255, 0.6)',
            border: '1px solid rgba(200, 221, 210, 0.5)'
          }}
        >
          <div className="text-4xl mb-4">📝</div>
          <p style={{ color: '#7A6F68' }}>No stories yet. Be the first to share when you feel ready.</p>
        </div>
      )}

      {!loading && !error && stories.length > 0 && (
        <div className="space-y-6">
          {stories.map((story, index) => {
            const isExpanded = expandedStories.has(story.id);
            const shouldTruncate = story.content.length > 200;
            const displayContent = isExpanded || !shouldTruncate 
              ? story.content 
              : story.content.slice(0, 200) + '...';

            return (
              <article
                key={story.id}
                className="rounded-2xl p-6 md:p-8 transition-all duration-200 animate-fade-in-up"
                style={{
                  animationDelay: `${index * 0.05}s`,
                  backgroundColor: 'rgba(255, 255, 255, 0.6)',
                  border: '1px solid rgba(200, 221, 210, 0.4)',
                  boxShadow: '0 2px 12px rgba(0, 0, 0, 0.03)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = '0 8px 30px rgba(0, 0, 0, 0.06)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = '0 2px 12px rgba(0, 0, 0, 0.03)';
                }}
              >
                <p 
                  className="text-base md:text-lg leading-relaxed mb-4"
                  style={{ color: '#5A524C', lineHeight: '1.7' }}
                >
                  {displayContent}
                </p>
                {shouldTruncate && (
                  <button
                    onClick={() => toggleStory(story.id)}
                    className="font-medium text-sm mb-4 transition-colors"
                    style={{ color: '#8FB8A2' }}
                    onMouseEnter={(e) => e.currentTarget.style.color = '#7AAE96'}
                    onMouseLeave={(e) => e.currentTarget.style.color = '#8FB8A2'}
                  >
                    {isExpanded ? 'Read Less' : 'Read More'}
                  </button>
                )}
                <div 
                  className="flex items-center justify-between text-sm mt-4 pt-4"
                  style={{ borderTop: '1px solid rgba(200, 221, 210, 0.4)' }}
                >
                  <span style={{ color: '#7A6F68' }}>
                    {story.author}
                  </span>
                  <div className="flex items-center gap-4">
                    <span style={{ color: '#7A6F68' }}>
                      {new Date(story.date).toLocaleDateString('en-US', { 
                        month: 'short', 
                        day: 'numeric', 
                        year: 'numeric' 
                      })}
                    </span>
                    <button
                      onClick={() => handleDelete(story.id)}
                      className="px-3 py-1 rounded-full text-xs font-medium transition-colors"
                      style={{ 
                        backgroundColor: 'rgba(239, 68, 68, 0.1)',
                        color: '#DC2626'
                      }}
                      title="Delete this story"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}

      <div 
        className="mt-12 p-8 rounded-2xl text-center"
        style={{ 
          backgroundColor: 'rgba(255, 255, 255, 0.5)',
          border: '1px solid rgba(200, 221, 210, 0.4)'
        }}
      >
        <p className="mb-2" style={{ color: '#5A524C' }}>
          There is no pressure to share. Reading is enough.
        </p>
        <p className="text-sm mb-6" style={{ color: '#7A6F68' }}>
          If you feel ready to share your story of survival, you can do so anonymously and safely.
        </p>
        <a
          href="/share"
          className="inline-block px-8 py-3 text-white rounded-full font-medium transition-all duration-200"
          style={{ 
            backgroundColor: '#8FB8A2',
            boxShadow: '0 2px 12px rgba(143, 184, 162, 0.25)'
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLElement).style.backgroundColor = '#7AAE96';
            (e.currentTarget as HTMLElement).style.transform = 'scale(1.02)';
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.backgroundColor = '#8FB8A2';
            (e.currentTarget as HTMLElement).style.transform = 'scale(1)';
          }}
        >
          Share Your Story
        </a>
      </div>
    </div>
  );
}
