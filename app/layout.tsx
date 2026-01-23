"use client";

import Link from "next/link";
import Image from "next/image";
import "./globals.css";
import logoImage from "./assets/logo.png";

function EmergencyBanner() {
  return (
    <div 
      className="py-3 px-4 backdrop-blur-sm"
      style={{ 
        backgroundColor: 'rgba(250, 247, 242, 0.5)'
      }}
    >
      <p 
        className="text-center text-xs sm:text-sm leading-relaxed max-w-3xl mx-auto"
        style={{ color: '#7A6F68' }}
      >
       
        <span className="font-medium ml-1" style={{ color: '#6B8F7B' }}></span>
      </p>
    </div>
  );
}

function Navbar() {
  return (
    <nav 
      className="py-5 px-4 sm:px-6 backdrop-blur-md transition-all duration-300"
      style={{ 
        backgroundColor: 'rgba(250, 247, 242, 0.8)'
      }}
    >
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between mb-5 relative gap-4">
          {/* Logo Image on Left - responsive sizing */}
          <div className="flex-shrink-0 md:absolute md:left-0">
            <Link href="/">
              <Image 
                src={logoImage}
                alt="You Are Not Alone Logo"
                width={160}
                height={160}
                className="transition-all duration-200 hover:scale-105 md:w-[260px] md:h-[260px] lg:w-[320px] lg:h-[320px]"
                style={{ 
                  objectFit: 'contain',
                  width: '160px',
                  height: '160px'
                }}
              />
            </Link>
          </div>
          
          {/* Logo Text - Centered on all screens */}
          <div className="md:absolute md:left-1/2 md:transform md:-translate-x-1/2 text-center mb-3 md:mb-6">
            <Link 
              href="/" 
              className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold transition-all duration-200 hover:scale-105 whitespace-nowrap"
              style={{ 
                color: '#2E2A28',
                letterSpacing: '-0.01em',
                fontFamily: '"Playfair Display", "Georgia", serif'
              }}
            >
              You Are Not Alone
            </Link>
          </div>
          
          {/* Spacer for balance on desktop */}
          <div className="hidden md:block flex-shrink-0 w-[260px] lg:w-[320px]"></div>
        </div>
        
        {/* Navigation Links - Centered */}
        <div className="flex justify-center space-x-3 mt-3 md:mt-0">
          <Link
            href="/"
            className="px-6 py-2.5 rounded-full text-sm font-semibold transition-all duration-200"
            style={{ 
              color: '#FFFFFF',
              backgroundColor: '#8FB8A2',
              boxShadow: '0 2px 8px rgba(143, 184, 162, 0.3)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#7AAE96';
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(143, 184, 162, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#8FB8A2';
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 2px 8px rgba(143, 184, 162, 0.3)';
            }}
          >
            Home
          </Link>
          <Link
            href="/stories"
            className="px-6 py-2.5 rounded-full text-sm font-semibold transition-all duration-200"
            style={{ 
              color: '#FFFFFF',
              backgroundColor: '#8FB8A2',
              boxShadow: '0 2px 8px rgba(143, 184, 162, 0.3)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#7AAE96';
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(143, 184, 162, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#8FB8A2';
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 2px 8px rgba(143, 184, 162, 0.3)';
            }}
          >
            Stories
          </Link>
          <Link
            href="/share"
            className="px-6 py-2.5 rounded-full text-sm font-semibold transition-all duration-200"
            style={{ 
              backgroundColor: '#8FB8A2',
              color: '#FFFFFF',
              boxShadow: '0 2px 8px rgba(143, 184, 162, 0.3)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#7AAE96';
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(143, 184, 162, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#8FB8A2';
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 2px 8px rgba(143, 184, 162, 0.3)';
            }}
          >
            Share
          </Link>
          <Link
            href="/admin"
            className="px-4 py-2.5 rounded-full text-xs font-medium transition-all duration-200 opacity-30 hover:opacity-100"
            style={{ 
              color: '#7A6F68',
              backgroundColor: 'transparent',
              border: '1px solid rgba(143, 184, 162, 0.3)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'rgba(143, 184, 162, 0.6)';
              e.currentTarget.style.color = '#5A524C';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'rgba(143, 184, 162, 0.3)';
              e.currentTarget.style.color = '#7A6F68';
            }}
            title="Admin Panel"
          >
            🔒
          </Link>
        </div>
      </div>
    </nav>
  );
}

function Footer() {
  return (
    <footer 
      className="mt-auto py-8 px-4 border-t backdrop-blur-sm"
      style={{ 
        backgroundColor: 'rgba(250, 247, 242, 0.5)',
        borderColor: 'rgba(200, 221, 210, 0.2)'
      }}
    >
      <div className="max-w-3xl mx-auto text-center">
        <div 
          className="w-12 h-0.5 rounded-full mx-auto mb-4 transition-all duration-300"
          style={{ backgroundColor: '#8FB8A2' }}
        ></div>
        <p className="text-sm mb-2" style={{ color: '#7A6F68' }}>
          © {new Date().getFullYear()} You Are Not Alone. A safe space for sharing.
        </p>
        <p className="text-sm" style={{ color: '#6B8F7B' }}>
          You are valued. Your story matters.
        </p>
      </div>
    </footer>
  );
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <title>You Are Not Alone - A Safe Space for Sharing</title>
        <meta name="description" content="A safe and supportive space to share and read stories of survival and hope" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
      </head>
      <body className="flex flex-col min-h-screen relative">
        <div className="relative z-10">
          <EmergencyBanner />
          <Navbar />
        </div>
        <main className="flex-grow relative z-10">{children}</main>
        <div className="relative z-10">
          <Footer />
        </div>
      </body>
    </html>
  );
}
