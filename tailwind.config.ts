import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'DM Sans', 'system-ui', 'sans-serif'],
      },
      colors: {
        // Warm Dawn Palette
        warmDawn: {
          cream: '#FAF7F2',
          beige: '#F3E9DC',
        },
        // Text Colors
        charcoal: '#2E2A28',
        warmGrayText: '#5A524C',
        mutedText: '#7A6F68',
        // Accent - Sage Green (Hope Color)
        sage: {
          50: '#f0f5f2',
          100: '#e1ebe5',
          200: '#C8DDD2',
          300: '#a8c9b8',
          400: '#8FB8A2',
          500: '#7AAE96',
          600: '#6B8F7B',
          700: '#5a7a6a',
          800: '#4a6557',
          900: '#3d5347',
        },
        // Legacy colors for compatibility
        pastelBlue: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
        },
        beige: {
          50: '#fdfcfb',
          100: '#faf8f5',
          200: '#f5f1ea',
          300: '#ebe4d8',
          400: '#ddd2bf',
          500: '#c9b89a',
        },
        warmGray: {
          50: '#fafaf9',
          100: '#f5f5f4',
          200: '#e7e5e4',
          300: '#d6d3d1',
          400: '#a8a29e',
          500: '#78716c',
        },
      },
      borderRadius: {
        'xl': '0.75rem',
        '2xl': '1rem',
        '3xl': '1.5rem',
      },
      boxShadow: {
        'soft': '0 4px 20px rgba(0, 0, 0, 0.04)',
        'soft-hover': '0 8px 30px rgba(0, 0, 0, 0.06)',
        'card': '0 2px 12px rgba(0, 0, 0, 0.03)',
      },
      animation: {
        'fade-in-up': 'fadeInUp 0.3s ease-out forwards',
        'fade-in': 'fadeIn 0.3s ease-out forwards',
      },
      keyframes: {
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
    },
  },
  plugins: [],
};
export default config;
