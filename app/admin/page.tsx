"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

// Admin panel for managing stories and comments

interface Story {
  id: string;
  content: string;
  author: string;
  date: string;
}

interface Comment {
  id: string;
  content: string;
  author: string;
  date: string;
}

export default function AdminPage() {
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [password, setPassword] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [expandedStories, setExpandedStories] = useState<Set<string>>(new Set());
  const [storyComments, setStoryComments] = useState<Record<string, Comment[]>>({});
  const [loadingComments, setLoadingComments] = useState<Set<string>>(new Set());
  const [showComments, setShowComments] = useState<Set<string>>(new Set());
  const router = useRouter();

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
    // Check if already authenticated in session
    const savedPassword = sessionStorage.getItem('adminPassword');
    if (savedPassword) {
      setPassword(savedPassword);
      setIsAuthenticated(true);
      fetchStories();
    } else {
      setLoading(false);
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!password.trim()) {
      setLoginError("Please enter the admin password");
      return;
    }
    
    // Save to session storage
    sessionStorage.setItem('adminPassword', password);
    setIsAuthenticated(true);
    setLoginError("");
    fetchStories();
  };

  const handleLogout = () => {
    sessionStorage.removeItem('adminPassword');
    setPassword("");
    setIsAuthenticated(false);
    setStories([]);
  };

  const fetchStories = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get<Story[]>("/api/stories");
      setStories(response.data);
    } catch (err) {
      console.error("Error fetching stories:", err);
      setError("Failed to load stories. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const fetchCommentsForStory = async (storyId: string) => {
    if (storyComments[storyId]) {
      // Already fetched, just toggle visibility
      setShowComments(prev => {
        const newSet = new Set(prev);
        if (newSet.has(storyId)) {
          newSet.delete(storyId);
        } else {
          newSet.add(storyId);
        }
        return newSet;
      });
      return;
    }

    setLoadingComments(prev => new Set(prev).add(storyId));
    try {
      const response = await axios.get<Comment[]>(`/api/stories/${storyId}/comments`);
      setStoryComments(prev => ({ ...prev, [storyId]: response.data }));
      setShowComments(prev => new Set(prev).add(storyId));
    } catch (err) {
      console.error("Error fetching comments:", err);
      alert("Failed to load comments");
    } finally {
      setLoadingComments(prev => {
        const newSet = new Set(prev);
        newSet.delete(storyId);
        return newSet;
      });
    }
  };

  const handleDeleteComment = async (commentId: string, commentPreview: string) => {
    const confirmText = commentPreview.length > 50 
      ? commentPreview.substring(0, 50) + "..." 
      : commentPreview;
      
    if (!window.confirm(`Are you sure you want to delete this comment?\n\n"${confirmText}"\n\nThis action cannot be undone.`)) {
      return;
    }

    try {
      await axios.delete(`/api/comments/${commentId}`, {
        headers: {
          'x-admin-password': password
        }
      });
      
      // Refresh comments for all stories that have them loaded
      const storiesWithComments = Object.keys(storyComments);
      for (const storyId of storiesWithComments) {
        const response = await axios.get<Comment[]>(`/api/stories/${storyId}/comments`);
        setStoryComments(prev => ({ ...prev, [storyId]: response.data }));
      }
      
      alert("Comment deleted successfully");
    } catch (err: any) {
      console.error("Error deleting comment:", err);
      if (err.response?.status === 401 || err.response?.status === 403) {
        alert("Invalid admin password. Please log in again.");
        handleLogout();
      } else {
        alert("Failed to delete comment. Please try again.");
      }
    }
  };

  const handleDelete = async (storyId: string, storyPreview: string) => {
    const confirmText = storyPreview.length > 50 
      ? storyPreview.substring(0, 50) + "..." 
      : storyPreview;
      
    if (!window.confirm(`Are you sure you want to delete this story?\n\n"${confirmText}"\n\nThis action cannot be undone.`)) {
      return;
    }

    try {
      await axios.delete(`/api/stories/${storyId}`, {
        headers: {
          'x-admin-password': password
        }
      });
      
      // Refresh the stories list
      fetchStories();
      alert("Story deleted successfully");
    } catch (err: any) {
      console.error("Error deleting story:", err);
      if (err.response?.status === 401 || err.response?.status === 403) {
        alert("Invalid admin password. Please log in again.");
        handleLogout();
      } else {
        alert("Failed to delete story. Please try again.");
      }
    }
  };

  // Login screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-[calc(100vh-12rem)] px-4 sm:px-6 py-12 flex items-center justify-center">
        <div 
          className="w-full max-w-md rounded-2xl p-8"
          style={{ 
            backgroundColor: 'rgba(255, 255, 255, 0.6)',
            border: '1px solid rgba(200, 221, 210, 0.5)',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.04)'
          }}
        >
          <h1 
            className="text-3xl font-bold mb-6 text-center"
            style={{ color: '#2E2A28', fontFamily: '"Playfair Display", "Georgia", serif' }}
          >
            Admin Access
          </h1>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label 
                htmlFor="password" 
                className="block text-sm font-medium mb-2"
                style={{ color: '#5A524C' }}
              >
                Admin Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-lg focus:outline-none focus:ring-2 transition-all"
                style={{ 
                  backgroundColor: 'rgba(255, 255, 255, 0.9)',
                  border: '1px solid rgba(200, 221, 210, 0.5)',
                  color: '#2E2A28'
                }}
                placeholder="Enter password"
                autoFocus
              />
            </div>
            {loginError && (
              <p className="text-sm" style={{ color: '#DC2626' }}>
                {loginError}
              </p>
            )}
            <button
              type="submit"
              className="w-full px-6 py-3 text-white rounded-full font-medium transition-all duration-200"
              style={{
                backgroundColor: '#8FB8A2',
                boxShadow: '0 2px 12px rgba(143, 184, 162, 0.25)'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#7AAE96'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#8FB8A2'}
            >
              Access Admin Panel
            </button>
          </form>
          <div className="mt-6 text-center">
            <button
              onClick={() => router.push('/')}
              className="text-sm transition-colors"
              style={{ color: '#8FB8A2' }}
              onMouseEnter={(e) => e.currentTarget.style.color = '#7AAE96'}
              onMouseLeave={(e) => e.currentTarget.style.color = '#8FB8A2'}
            >
              ← Back to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Admin panel
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 md:py-16">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 
            className="text-3xl sm:text-4xl font-bold"
            style={{ color: '#2E2A28', fontFamily: '"Playfair Display", "Georgia", serif' }}
          >
            Admin Panel
          </h1>
          <p style={{ color: '#7A6F68' }} className="mt-2">
            Manage community stories
          </p>
        </div>
        <button
          onClick={handleLogout}
          className="px-4 py-2 text-sm rounded-full font-medium transition-all duration-200"
          style={{
            backgroundColor: 'rgba(239, 68, 68, 0.1)',
            color: '#DC2626'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.2)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.1)';
          }}
        >
          Logout
        </button>
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
          <p style={{ color: '#7A6F68' }}>No stories to manage at the moment.</p>
        </div>
      )}

      {!loading && !error && stories.length > 0 && (
        <div>
          <div 
            className="mb-4 p-4 rounded-lg text-sm"
            style={{ 
              backgroundColor: 'rgba(255, 255, 255, 0.6)',
              border: '1px solid rgba(200, 221, 210, 0.5)'
            }}
          >
            <p style={{ color: '#5A524C' }}>
              <strong>Total Stories:</strong> {stories.length}
            </p>
          </div>

          <div className="space-y-4">
            {stories.map((story, index) => {
              const isExpanded = expandedStories.has(story.id);
              const shouldTruncate = story.content.length > 200;
              const displayContent = isExpanded || !shouldTruncate 
                ? story.content 
                : story.content.slice(0, 200) + '...';

              return (
                <article
                  key={story.id}
                  className="rounded-2xl p-6 transition-all duration-200"
                  style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.6)',
                    border: '1px solid rgba(200, 221, 210, 0.4)',
                    boxShadow: '0 2px 12px rgba(0, 0, 0, 0.03)'
                  }}
                >
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span 
                          className="text-xs font-mono px-2 py-1 rounded"
                          style={{ 
                            backgroundColor: 'rgba(143, 184, 162, 0.1)',
                            color: '#7A6F68'
                          }}
                        >
                          #{index + 1}
                        </span>
                        <span style={{ color: '#7A6F68' }} className="text-sm">
                          {story.author}
                        </span>
                        <span style={{ color: '#7A6F68' }} className="text-sm">
                          •
                        </span>
                        <span style={{ color: '#7A6F68' }} className="text-sm">
                          {new Date(story.date).toLocaleDateString('en-US', { 
                            month: 'short', 
                            day: 'numeric', 
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => handleDelete(story.id, story.content)}
                      className="px-4 py-2 rounded-full text-sm font-medium transition-all duration-200"
                      style={{ 
                        backgroundColor: 'rgba(239, 68, 68, 0.1)',
                        color: '#DC2626'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.2)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.1)';
                      }}
                      title="Delete this story"
                    >
                      Delete
                    </button>
                  </div>

                  <p 
                    className="text-base leading-relaxed mb-2"
                    style={{ color: '#5A524C', lineHeight: '1.7' }}
                  >
                    {displayContent}
                  </p>
                  
                  {shouldTruncate && (
                    <button
                      onClick={() => toggleStory(story.id)}
                      className="font-medium text-sm transition-colors"
                      style={{ color: '#8FB8A2' }}
                      onMouseEnter={(e) => e.currentTarget.style.color = '#7AAE96'}
                      onMouseLeave={(e) => e.currentTarget.style.color = '#8FB8A2'}
                    >
                      {isExpanded ? 'Read Less' : 'Read More'}
                    </button>
                  )}

                  <div className="mt-4 pt-4" style={{ borderTop: '1px solid rgba(200, 221, 210, 0.3)' }}>
                    <button
                      onClick={() => fetchCommentsForStory(story.id)}
                      className="text-sm font-medium transition-colors flex items-center gap-2"
                      style={{ color: '#8FB8A2' }}
                      onMouseEnter={(e) => e.currentTarget.style.color = '#7AAE96'}
                      onMouseLeave={(e) => e.currentTarget.style.color = '#8FB8A2'}
                      disabled={loadingComments.has(story.id)}
                    >
                      {loadingComments.has(story.id) ? (
                        'Loading comments...'
                      ) : showComments.has(story.id) ? (
                        `Hide Comments${storyComments[story.id] ? ` (${storyComments[story.id].length})` : ''}`
                      ) : (
                        'Show Comments'
                      )}
                    </button>

                    {showComments.has(story.id) && storyComments[story.id] && (
                      <div className="mt-3 space-y-3">
                        {storyComments[story.id].length === 0 ? (
                          <p className="text-sm" style={{ color: '#7A6F68' }}>No comments yet</p>
                        ) : (
                          storyComments[story.id].map((comment) => (
                            <div
                              key={comment.id}
                              className="rounded-lg p-4"
                              style={{
                                backgroundColor: 'rgba(255, 255, 255, 0.5)',
                                border: '1px solid rgba(200, 221, 210, 0.3)'
                              }}
                            >
                              <div className="flex items-start justify-between gap-3 mb-2">
                                <div className="flex items-center gap-2 text-xs" style={{ color: '#7A6F68' }}>
                                  <span>{comment.author}</span>
                                  <span>•</span>
                                  <span>
                                    {new Date(comment.date).toLocaleDateString('en-US', { 
                                      month: 'short', 
                                      day: 'numeric', 
                                      hour: '2-digit',
                                      minute: '2-digit'
                                    })}
                                  </span>
                                </div>
                                <button
                                  onClick={() => handleDeleteComment(comment.id, comment.content)}
                                  className="px-3 py-1 rounded-full text-xs font-medium transition-all duration-200"
                                  style={{ 
                                    backgroundColor: 'rgba(239, 68, 68, 0.1)',
                                    color: '#DC2626'
                                  }}
                                  onMouseEnter={(e) => {
                                    e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.2)';
                                  }}
                                  onMouseLeave={(e) => {
                                    e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.1)';
                                  }}
                                  title="Delete this comment"
                                >
                                  Delete
                                </button>
                              </div>
                              <p className="text-sm" style={{ color: '#5A524C' }}>
                                {comment.content}
                              </p>
                            </div>
                          ))
                        )}
                      </div>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
