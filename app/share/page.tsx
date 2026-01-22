"use client";

import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function ShareStoryPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    story: "",
    isAnonymous: true,
    authorName: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.story.trim().length < 10) {
      setError("Story must be at least 10 characters long.");
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);
      
      await axios.post("http://localhost:8000/api/stories", {
        content: formData.story,
        isAnonymous: formData.isAnonymous,
        authorName: formData.authorName
      });
      
      // Reset form
      setFormData({
        story: "",
        isAnonymous: true,
        authorName: ""
      });
      
      // Show success message and redirect to stories page
      alert("Thank you for sharing your story! 💙");
      router.push("/stories");
    } catch (err) {
      console.error("Error submitting story:", err);
      setError("Failed to submit your story. Make sure the backend server is running on port 8000.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      story: e.target.value
    }));
    setError(null);
  };

  const toggleAnonymous = () => {
    setFormData(prev => ({
      ...prev,
      isAnonymous: !prev.isAnonymous
    }));
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-12 md:py-16">
      {/* Header Section */}
      <div className="text-center mb-10 animate-fade-in">
        <h1 
          className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4"
          style={{ color: '#2E2A28', fontFamily: '"Playfair Display", "Georgia", serif' }}
        >
          Share Your Story
        </h1>
        <p 
          className="text-lg max-w-xl mx-auto"
          style={{ color: '#5A524C', lineHeight: '1.7' }}
        >
          Your journey from darkness to light could be the hope someone needs today.
        </p>
      </div>

      {/* What to share card */}
      <div 
        className="rounded-2xl p-6 md:p-8 mb-8 animate-fade-in-up"
        style={{ 
          animationDelay: '0.1s',
          backgroundColor: 'rgba(255, 255, 255, 0.6)',
          border: '1px solid rgba(200, 221, 210, 0.5)',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.04)'
        }}
      >
        <h3 className="font-bold mb-4 text-lg" style={{ color: '#2E2A28', fontFamily: '"Playfair Display", "Georgia", serif' }}>
          What to share:
        </h3>
        <ul className="text-sm space-y-3" style={{ color: '#5A524C' }}>
          <li className="flex items-start gap-3">
            <span style={{ color: '#8FB8A2' }}>•</span>
            <span>What you were going through when thoughts were darkest</span>
          </li>
          <li className="flex items-start gap-3">
            <span style={{ color: '#8FB8A2' }}>•</span>
            <span>What helped you choose to stay or seek help</span>
          </li>
          <li className="flex items-start gap-3">
            <span style={{ color: '#8FB8A2' }}>•</span>
            <span>How you&apos;re doing now - even small progress counts</span>
          </li>
          <li className="flex items-start gap-3">
            <span style={{ color: '#8FB8A2' }}>•</span>
            <span>What you wish others knew about recovery</span>
          </li>
        </ul>
      </div>

      {error && (
        <div 
          className="rounded-2xl p-5 mb-8 text-center"
          style={{ 
            backgroundColor: 'rgba(254, 242, 242, 0.8)',
            border: '1px solid rgba(252, 165, 165, 0.5)'
          }}
        >
          <p style={{ color: '#DC2626' }}>{error}</p>
        </div>
      )}

      <form 
        onSubmit={handleSubmit} 
        className="rounded-2xl p-6 md:p-8 space-y-6 animate-fade-in-up transition-all duration-200"
        style={{ 
          animationDelay: '0.2s',
          backgroundColor: 'rgba(255, 255, 255, 0.6)',
          border: '1px solid rgba(200, 221, 210, 0.5)',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.04)'
        }}
      >
        {/* Textarea for story */}
        <div>
          <label 
            htmlFor="story" 
            className="block font-semibold text-lg mb-3"
            style={{ color: '#2E2A28' }}
          >
            Your Story
          </label>
          <textarea
            id="story"
            name="story"
            required
            value={formData.story}
            onChange={handleChange}
            rows={10}
            className="w-full px-4 py-4 rounded-xl focus:outline-none focus:ring-2 transition-all resize-y text-base leading-relaxed"
            style={{ 
              backgroundColor: '#FFFFFF',
              border: '1px solid #C8DDD2',
              color: '#5A524C'
            }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = '#8FB8A2';
              e.currentTarget.style.boxShadow = '0 0 0 3px rgba(143, 184, 162, 0.15)';
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = '#C8DDD2';
              e.currentTarget.style.boxShadow = 'none';
            }}
            placeholder="Share your story... What was happening when you felt darkest? What helped you find hope? What would you tell someone going through this now?"
          />
          <p className="text-sm mt-2 italic" style={{ color: '#6B8F7B' }}>
            Your story could be the hope someone needs today.
          </p>
        </div>

        {/* Anonymous toggle */}
        <div 
          className="rounded-xl p-5"
          style={{ 
            backgroundColor: 'rgba(143, 184, 162, 0.08)',
            border: '1px solid rgba(200, 221, 210, 0.5)'
          }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold" style={{ color: '#2E2A28' }}>
                Post Anonymously
              </p>
              <p className="text-sm mt-1" style={{ color: '#7A6F68' }}>
                Your identity will remain private
              </p>
            </div>
            <button
              type="button"
              onClick={toggleAnonymous}
              className="relative inline-flex h-8 w-14 items-center rounded-full transition-all focus:outline-none focus:ring-2 focus:ring-offset-2"
              style={{ 
                backgroundColor: formData.isAnonymous ? '#8FB8A2' : '#D1D5DB'
              }}
              aria-label="Toggle anonymous posting"
            >
              <span
                className="inline-block h-6 w-6 transform rounded-full bg-white shadow transition-transform"
                style={{ 
                  transform: formData.isAnonymous ? 'translateX(26px)' : 'translateX(2px)'
                }}
              />
            </button>
          </div>
          
          {/* Name input when not anonymous */}
          {!formData.isAnonymous && (
            <div className="mt-4 pt-4" style={{ borderTop: '1px solid rgba(200, 221, 210, 0.5)' }}>
              <label 
                htmlFor="authorName" 
                className="block font-medium text-sm mb-2"
                style={{ color: '#2E2A28' }}
              >
                Your Name (Optional)
              </label>
              <input
                type="text"
                id="authorName"
                name="authorName"
                value={formData.authorName}
                onChange={(e) => setFormData(prev => ({ ...prev, authorName: e.target.value }))}
                className="w-full px-4 py-2.5 rounded-lg focus:outline-none focus:ring-2 transition-all text-base"
                style={{ 
                  backgroundColor: '#FFFFFF',
                  border: '1px solid #C8DDD2',
                  color: '#5A524C'
                }}
                placeholder="e.g., Sarah M., or leave blank"
                maxLength={50}
              />
              <p className="text-xs mt-2" style={{ color: '#7A6F68' }}>
                This will appear with your story
              </p>
            </div>
          )}
        </div>

        {/* Submit button */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={isSubmitting || formData.story.trim().length < 10}
            className="w-full px-8 py-4 text-white rounded-full font-medium text-lg transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ 
              backgroundColor: '#8FB8A2',
              boxShadow: '0 2px 12px rgba(143, 184, 162, 0.25)'
            }}
            onMouseEnter={(e) => {
              if (!isSubmitting && formData.story.trim().length >= 10) {
                e.currentTarget.style.backgroundColor = '#7AAE96';
                e.currentTarget.style.transform = 'scale(1.02)';
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#8FB8A2';
              e.currentTarget.style.transform = 'scale(1)';
            }}
          >
            {isSubmitting ? (
              <>
                <div 
                  className="animate-spin rounded-full h-5 w-5 border-2"
                  style={{ borderColor: 'rgba(255,255,255,0.3)', borderTopColor: '#FFFFFF' }}
                ></div>
                <span>Sharing...</span>
              </>
            ) : (
              <span>Share Your Story</span>
            )}
          </button>
        </div>
      </form>

      {/* Guidelines */}
      <div 
        className="mt-8 p-6 rounded-2xl"
        style={{ 
          backgroundColor: 'rgba(255, 255, 255, 0.5)',
          border: '1px solid rgba(200, 221, 210, 0.4)'
        }}
      >
        <h3 className="font-semibold mb-4" style={{ color: '#2E2A28' }}>
          Sharing Guidelines
        </h3>
        <ul className="text-sm space-y-2" style={{ color: '#5A524C' }}>
          <li className="flex items-start gap-2">
            <span style={{ color: '#8FB8A2' }}>•</span>
            <span><strong>Focus on hope:</strong> Share what helped you survive</span>
          </li>
          <li className="flex items-start gap-2">
            <span style={{ color: '#8FB8A2' }}>•</span>
            <span><strong>Be mindful:</strong> Avoid graphic details</span>
          </li>
          <li className="flex items-start gap-2">
            <span style={{ color: '#8FB8A2' }}>•</span>
            <span><strong>Share resources:</strong> What support helped you?</span>
          </li>
          <li className="flex items-start gap-2">
            <span style={{ color: '#8FB8A2' }}>•</span>
            <span><strong>Be authentic:</strong> Every journey is different</span>
          </li>
        </ul>
      </div>

      {/* Reassurance */}
      <p 
        className="text-center text-sm mt-6"
        style={{ color: '#7A6F68' }}
      >
        There is no pressure to share. You are in control.
      </p>
    </div>
  );
}
