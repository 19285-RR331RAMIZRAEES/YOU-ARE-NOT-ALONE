"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { Story, Comment, ReactionData } from "@/lib/types";
import { REACTION_TYPES, STORAGE_KEYS } from "@/lib/constants";

export default function StoriesPage() {
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedStories, setExpandedStories] = useState<Set<string>>(new Set());
  const [ownedStories, setOwnedStories] = useState<Set<string>>(new Set());
  const [commentsVisible, setCommentsVisible] = useState<Set<string>>(new Set());
  const [comments, setComments] = useState<Record<string, Comment[]>>({});
  const [newComment, setNewComment] = useState<Record<string, string>>({});
  const [commentAnonymous, setCommentAnonymous] = useState<Record<string, boolean>>({});
  const [commentName, setCommentName] = useState<Record<string, string>>({});
  const [reactions, setReactions] = useState<Record<string, ReactionData>>({});
  const [userToken, setUserToken] = useState<string>('');

  useEffect(() => {
    // Get or create user token for reactions
    let token = localStorage.getItem(STORAGE_KEYS.USER_TOKEN);
    if (!token) {
      token = Math.random().toString(36).substring(2) + Date.now().toString(36);
      localStorage.setItem(STORAGE_KEYS.USER_TOKEN, token);
    }
    setUserToken(token);
  }, []);

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

  const toggleComments = async (storyId: string) => {
    const newSet = new Set(commentsVisible);
    if (newSet.has(storyId)) {
      newSet.delete(storyId);
    } else {
      newSet.add(storyId);
      // Load comments if not already loaded
      if (!comments[storyId]) {
        await fetchComments(storyId);
      }
    }
    setCommentsVisible(newSet);
  };

  useEffect(() => {
    fetchStories();
    loadOwnedStories();
  }, []);

  const loadOwnedStories = () => {
    try {
      const tokens = JSON.parse(localStorage.getItem(STORAGE_KEYS.STORY_TOKENS) || '{}');
      setOwnedStories(new Set(Object.keys(tokens)));
    } catch (err) {
      console.error('Error loading owned stories:', err);
    }
  };

  const fetchStories = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get<Story[]>("/api/stories");
      setStories(response.data);
      
      // Fetch reactions for all stories
      response.data.forEach(story => {
        fetchReactions(story.id);
      });
    } catch (err) {
      console.error("Error fetching stories:", err);
      setError("Failed to load stories. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const fetchReactions = async (storyId: string) => {
    try {
      const response = await axios.get(`/api/stories/${storyId}/reactions`, {
        headers: { 'x-user-token': userToken }
      });
      setReactions(prev => ({ ...prev, [storyId]: response.data }));
    } catch (err) {
      console.error("Error fetching reactions:", err);
    }
  };

  const fetchComments = async (storyId: string) => {
    try {
      const response = await axios.get<Comment[]>(`/api/stories/${storyId}/comments`);
      setComments(prev => ({ ...prev, [storyId]: response.data }));
    } catch (err) {
      console.error("Error fetching comments:", err);
    }
  };

  const handleReaction = async (storyId: string, reactionType: string) => {
    try {
      const response = await axios.post(`/api/stories/${storyId}/reactions`, 
        { reactionType },
        { headers: { 'x-user-token': userToken } }
      );
      
      // Update user token if server provided a new one
      if (response.data.userToken && response.data.userToken !== userToken) {
        setUserToken(response.data.userToken);
        localStorage.setItem(STORAGE_KEYS.USER_TOKEN, response.data.userToken);
      }
      
      // Refresh reactions
      await fetchReactions(storyId);
    } catch (err) {
      console.error("Error toggling reaction:", err);
    }
  };

  const handleCommentSubmit = async (storyId: string) => {
    const content = newComment[storyId]?.trim();
    if (!content) return;

    try {
      const isAnonymous = commentAnonymous[storyId] !== false; // Default to anonymous
      const authorName = !isAnonymous ? commentName[storyId] : null;

      await axios.post(`/api/stories/${storyId}/comments`, {
        content,
        isAnonymous,
        authorName
      });

      // Clear form
      setNewComment(prev => ({ ...prev, [storyId]: '' }));
      setCommentName(prev => ({ ...prev, [storyId]: '' }));
      
      // Refresh comments
      await fetchComments(storyId);
    } catch (err: unknown) {
      console.error("Error posting comment:", err);
      const axiosError = err as { response?: { data?: { error?: string } } };
      alert(axiosError.response?.data?.error || "Failed to post comment");
    }
  };

  const handleDelete = async (storyId: string) => {
    if (!window.confirm("Are you sure you want to delete this story? This action cannot be undone.")) {
      return;
    }

    try {
      // Get the deletion token from localStorage
      const tokens = JSON.parse(localStorage.getItem(STORAGE_KEYS.STORY_TOKENS) || '{}');
      const deletionToken = tokens[storyId];
      
      if (!deletionToken) {
        alert("You can only delete stories that you have shared.");
        return;
      }
      
      // Send delete request with token in header
      await axios.delete(`/api/stories/${storyId}`, {
        headers: {
          'x-deletion-token': deletionToken
        }
      });
      
      // Remove token from localStorage
      delete tokens[storyId];
      localStorage.setItem(STORAGE_KEYS.STORY_TOKENS, JSON.stringify(tokens));
      setOwnedStories(new Set(Object.keys(tokens)));
      
      // Refresh the stories list
      fetchStories();
    } catch (err: unknown) {
      console.error("Error deleting story:", err);
      const axiosError = err as { response?: { status?: number } };
      if (axiosError.response?.status === 403 || axiosError.response?.status === 401) {
        alert("You can only delete stories that you have shared.");
      } else {
        alert("Failed to delete story. Please try again.");
      }
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
            const storyReactions = reactions[story.id] || { counts: {}, userReactions: [] };
            const storyComments = comments[story.id] || [];
            const showComments = commentsVisible.has(story.id);

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
                {/* Story Content */}
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

                {/* Reactions */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {REACTION_TYPES.map(({ type, emoji, label }) => {
                    const count = storyReactions.counts[type] || 0;
                    const isActive = storyReactions.userReactions?.includes(type);
                    
                    return (
                      <button
                        key={type}
                        onClick={() => handleReaction(story.id, type)}
                        className="px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200 flex items-center gap-1.5"
                        style={{
                          backgroundColor: isActive ? 'rgba(143, 184, 162, 0.2)' : 'rgba(143, 184, 162, 0.1)',
                          border: isActive ? '1.5px solid #8FB8A2' : '1px solid rgba(143, 184, 162, 0.3)',
                          color: isActive ? '#6B8F7B' : '#7A6F68'
                        }}
                        title={label}
                      >
                        <span>{emoji}</span>
                        {count > 0 && <span>{count}</span>}
                      </button>
                    );
                  })}
                </div>

                {/* Author and Date Info */}
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
                    {ownedStories.has(story.id) && (
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
                    )}
                  </div>
                </div>

                {/* Comments Toggle */}
                <div className="mt-4">
                  <button
                    onClick={() => toggleComments(story.id)}
                    className="text-sm font-medium transition-colors flex items-center gap-2"
                    style={{ color: '#8FB8A2' }}
                    onMouseEnter={(e) => e.currentTarget.style.color = '#7AAE96'}
                    onMouseLeave={(e) => e.currentTarget.style.color = '#8FB8A2'}
                  >
                    <span>💬</span>
                    <span>{showComments ? 'Hide' : 'Show'} Comments ({storyComments.length})</span>
                  </button>
                </div>

                {/* Comments Section */}
                {showComments && (
                  <div className="mt-4 space-y-4">
                    {/* Existing Comments */}
                    {storyComments.length > 0 && (
                      <div className="space-y-3">
                        {storyComments.map((comment) => (
                          <div
                            key={comment.id}
                            className="rounded-lg p-4"
                            style={{
                              backgroundColor: 'rgba(143, 184, 162, 0.05)',
                              border: '1px solid rgba(143, 184, 162, 0.2)'
                            }}
                          >
                            <p className="text-sm mb-2" style={{ color: '#5A524C' }}>
                              {comment.content}
                            </p>
                            <div className="flex items-center gap-2 text-xs" style={{ color: '#7A6F68' }}>
                              <span>{comment.author}</span>
                              <span>•</span>
                              <span>
                                {new Date(comment.date).toLocaleDateString('en-US', {
                                  month: 'short',
                                  day: 'numeric'
                                })}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Add Comment Form */}
                    <div className="space-y-3">
                      <textarea
                        value={newComment[story.id] || ''}
                        onChange={(e) => setNewComment(prev => ({ ...prev, [story.id]: e.target.value }))}
                        placeholder="Share your thoughts of support..."
                        className="w-full px-4 py-3 rounded-lg text-sm resize-none focus:outline-none focus:ring-2 transition-all"
                        style={{
                          backgroundColor: 'rgba(255, 255, 255, 0.9)',
                          border: '1px solid rgba(200, 221, 210, 0.5)',
                          color: '#2E2A28',
                          minHeight: '80px'
                        }}
                        maxLength={1000}
                      />
                      
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <label className="flex items-center gap-2 text-sm cursor-pointer">
                            <input
                              type="checkbox"
                              checked={commentAnonymous[story.id] !== false}
                              onChange={(e) => setCommentAnonymous(prev => ({ ...prev, [story.id]: !e.target.checked }))}
                              className="rounded"
                              style={{ accentColor: '#8FB8A2' }}
                            />
                            <span style={{ color: '#7A6F68' }}>Post anonymously</span>
                          </label>
                          {commentAnonymous[story.id] === false && (
                            <input
                              type="text"
                              value={commentName[story.id] || ''}
                              onChange={(e) => setCommentName(prev => ({ ...prev, [story.id]: e.target.value }))}
                              placeholder="Your name"
                              className="px-3 py-1.5 rounded-lg text-sm focus:outline-none focus:ring-2"
                              style={{
                                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                                border: '1px solid rgba(200, 221, 210, 0.5)',
                                color: '#2E2A28'
                              }}
                              maxLength={50}
                            />
                          )}
                        </div>
                        
                        <button
                          onClick={() => handleCommentSubmit(story.id)}
                          disabled={!newComment[story.id]?.trim()}
                          className="px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                          style={{
                            backgroundColor: '#8FB8A2',
                            color: '#FFFFFF'
                          }}
                          onMouseEnter={(e) => {
                            if (!e.currentTarget.disabled) {
                              e.currentTarget.style.backgroundColor = '#7AAE96';
                            }
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = '#8FB8A2';
                          }}
                        >
                          Post
                        </button>
                      </div>
                    </div>
                  </div>
                )}
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
