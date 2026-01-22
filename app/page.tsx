"use client";

import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-[calc(100vh-12rem)] px-4 sm:px-6 py-12 sm:py-16 md:py-20">
      <div className="max-w-3xl mx-auto">
        
        {/* Hero Section - Text First */}
        <section className="text-center mb-16 md:mb-20 animate-fade-in">
          <h1 
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight"
            style={{ color: '#2E2A28', lineHeight: '1.3', fontFamily: '"Playfair Display", "Georgia", serif' }}
          >
            You don&apos;t have to go through this alone.
          </h1>
          <p 
            className="text-lg sm:text-xl md:text-2xl mb-10 max-w-2xl mx-auto"
            style={{ color: '#5A524C', lineHeight: '1.7' }}
          >
            This is a quiet, safe space to share, read, and find strength through real stories of survival and hope.
          </p>
          
          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              href="/stories"
              className="w-full sm:w-auto px-8 py-3.5 text-white rounded-full font-medium text-base sm:text-lg transition-all duration-200"
              style={{
                backgroundColor: '#8FB8A2',
                boxShadow: '0 2px 12px rgba(143, 184, 162, 0.25)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#7AAE96';
                e.currentTarget.style.transform = 'scale(1.02)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#8FB8A2';
                e.currentTarget.style.transform = 'scale(1)';
              }}
            >
              Read Stories
            </Link>
            <Link
              href="/share"
              className="w-full sm:w-auto px-8 py-3.5 text-white rounded-full font-medium text-base sm:text-lg transition-all duration-200"
              style={{
                backgroundColor: '#8FB8A2',
                boxShadow: '0 2px 12px rgba(143, 184, 162, 0.25)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#7AAE96';
                e.currentTarget.style.transform = 'scale(1.02)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#8FB8A2';
                e.currentTarget.style.transform = 'scale(1)';
              }}
            >
              Share Your Story
            </Link>
          </div>
        </section>

        {/* Purpose Card */}
        <section 
          className="mb-16 md:mb-20 animate-fade-in-up rounded-2xl p-8 md:p-10 transition-all duration-200"
          style={{ 
            animationDelay: '0.1s',
            backgroundColor: 'rgba(255, 255, 255, 0.6)',
            border: '1px solid rgba(200, 221, 210, 0.5)',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.04)'
          }}
        >
          <h2 
            className="text-2xl sm:text-3xl font-bold mb-6 text-center"
            style={{ color: '#2E2A28', fontFamily: '"Playfair Display", "Georgia", serif' }}
          >
            You Are Not Alone
          </h2>
          <div className="max-w-xl mx-auto space-y-4">
            <p style={{ color: '#5A524C', lineHeight: '1.7' }}>
              This is a quiet, supportive space for people who have experienced deep emotional pain including depression, suicidal thoughts, or moments when life felt overwhelming.
            </p>
            <p style={{ color: '#5A524C', lineHeight: '1.7' }}>
              Here, you can read real stories shared by people who have been through similar struggles and found ways to keep going. Some share how they survived their darkest moments. Others share what helped them cope, heal, or simply make it through one more day.
            </p>
            <p style={{ color: '#5A524C', lineHeight: '1.7' }}>
              You are welcome to share your own story too anonymously or with your name, entirely by your choice. There is no pressure to speak, no expectation to be strong, and no judgment here.
            </p>
            <p style={{ color: '#5A524C', lineHeight: '1.7' }}>
              For some, putting their experience into words can feel like setting down a heavy weight they&apos;ve been carrying alone. Sharing may bring a sense of relief, clarity, or lightness but only if and when it feels right for you.
            </p>
            <p style={{ color: '#5A524C', lineHeight: '1.7' }}>
              Your story may also quietly reach someone who is struggling in silence. Many people who feel overwhelmed or have suicidal thoughts find it difficult to talk to anyone in their life. Here, they can read and share anonymously, without fear, and feel less alone in what they are going through.
            </p>
            <p style={{ color: '#5A524C', lineHeight: '1.7', fontWeight: '600' }}>
              This platform exists for one simple reason: so no one has to face their pain by themselves.
            </p>
            <p style={{ color: '#5A524C', lineHeight: '1.7' }}>
              Sharing is always your choice. Reading quietly is just as welcome.
            </p>
            <p style={{ color: '#5A524C', lineHeight: '1.7' }}>
              Whether you are here to read, to share when you feel ready, or to offer gentle encouragement to others you belong here.
            </p>
          </div>
        </section>

        {/* How It Helps - 3 Soft Cards */}
        <section className="mb-16 md:mb-20">
          <div className="grid gap-6 md:grid-cols-3">
            {/* Card 1: You are heard */}
            <div 
              className="animate-fade-in-up rounded-2xl p-6 text-center transition-all duration-200"
              style={{ 
                animationDelay: '0.15s',
                backgroundColor: 'rgba(255, 255, 255, 0.5)',
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
              <div 
                className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4"
                style={{ backgroundColor: 'rgba(143, 184, 162, 0.15)' }}
              >
                <svg className="w-6 h-6" fill="none" stroke="#8FB8A2" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <h3 className="font-bold text-lg mb-2" style={{ color: '#2E2A28', fontFamily: '"Playfair Display", "Georgia", serif' }}>
                You are heard
              </h3>
              <p className="text-sm" style={{ color: '#7A6F68' }}>
                Share without judgment.
              </p>
            </div>

            {/* Card 2: You are safe */}
            <div 
              className="animate-fade-in-up rounded-2xl p-6 text-center transition-all duration-200"
              style={{ 
                animationDelay: '0.2s',
                backgroundColor: 'rgba(255, 255, 255, 0.5)',
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
              <div 
                className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4"
                style={{ backgroundColor: 'rgba(143, 184, 162, 0.15)' }}
              >
                <svg className="w-6 h-6" fill="none" stroke="#8FB8A2" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="font-bold text-lg mb-2" style={{ color: '#2E2A28', fontFamily: '"Playfair Display", "Georgia", serif' }}>
                You are safe
              </h3>
              <p className="text-sm" style={{ color: '#7A6F68' }}>
                Post anonymously or with your name.
              </p>
            </div>

            {/* Card 3: You are helping */}
            <div 
              className="animate-fade-in-up rounded-2xl p-6 text-center transition-all duration-200"
              style={{ 
                animationDelay: '0.25s',
                backgroundColor: 'rgba(255, 255, 255, 0.5)',
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
              <div 
                className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4"
                style={{ backgroundColor: 'rgba(143, 184, 162, 0.15)' }}
              >
                <svg className="w-6 h-6" fill="none" stroke="#8FB8A2" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <h3 className="font-bold text-lg mb-2" style={{ color: '#2E2A28', fontFamily: '"Playfair Display", "Georgia", serif' }}>
                You are helping
              </h3>
              <p className="text-sm" style={{ color: '#7A6F68' }}>
                Your story may reach someone at their lowest moment.
              </p>
            </div>
          </div>
        </section>

        {/* Final Gentle CTA */}
        <section className="text-center animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
          <p 
            className="text-lg sm:text-xl mb-6 italic"
            style={{ color: '#5A524C' }}
          >
            &quot;If you&apos;re ready, your story is welcome here.&quot;
          </p>
          <Link
            href="/share"
            className="inline-block px-8 py-3.5 text-white rounded-full font-medium text-base transition-all duration-200"
            style={{
              backgroundColor: '#8FB8A2',
              boxShadow: '0 2px 12px rgba(143, 184, 162, 0.25)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#7AAE96';
              e.currentTarget.style.transform = 'scale(1.02)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#8FB8A2';
              e.currentTarget.style.transform = 'scale(1)';
            }}
          >
            Share when you feel ready
          </Link>
          <p 
            className="text-sm mt-6"
            style={{ color: '#7A6F68' }}
          >
            There is no pressure. Reading is enough.
          </p>
        </section>

      </div>
    </div>
  );
}
