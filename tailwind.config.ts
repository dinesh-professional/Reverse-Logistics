import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        background: '#08080F',
        surface: {
          DEFAULT: '#111119',
          card: '#111119',
          border: '#1E1630',
          hover: '#1A1A2E',
        },
        primary: {
          DEFAULT: '#A855F7',
          hover: '#9333EA',
          light: 'rgba(168, 85, 247, 0.1)',
          glow: 'rgba(168, 85, 247, 0.35)',
        },
        accent: {
          DEFAULT: '#C084FC',
          light: '#DDD6FE',
          dark: '#7C3AED',
        },
        neon: {
          purple: '#A855F7',
          violet: '#7C3AED',
          fuchsia: '#D946EF',
          blue: '#818CF8',
        },
        risk: {
          high: '#F43F5E',
          'high-bg': 'rgba(244, 63, 94, 0.1)',
          medium: '#F59E0B',
          'medium-bg': 'rgba(245, 158, 11, 0.1)',
          low: '#10B981',
          'low-bg': 'rgba(16, 185, 129, 0.1)',
        }
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.4)',
        'purple-glow': '0 4px 20px 0 rgba(168, 85, 247, 0.4)',
        'purple-glow-lg': '0 8px 40px 0 rgba(168, 85, 247, 0.3)',
        'green-glow': '0 4px 14px 0 rgba(16, 185, 129, 0.35)',
        'red-glow': '0 4px 14px 0 rgba(244, 63, 94, 0.35)',
        'neon': '0 0 20px rgba(168, 85, 247, 0.3), 0 0 60px rgba(168, 85, 247, 0.1)',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      animation: {
        'pulse-glow': 'pulseGlow 3s ease-in-out infinite',
        'float': 'float 6s ease-in-out infinite',
        'float-slow': 'floatSlow 10s ease-in-out infinite',
        'orbit': 'orbit 20s linear infinite',
        'shimmer': 'shimmer 3s ease-in-out infinite',
      },
      keyframes: {
        pulseGlow: {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.6', transform: 'scale(1.05)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px) translateX(0px)' },
          '33%': { transform: 'translateY(-20px) translateX(10px)' },
          '66%': { transform: 'translateY(10px) translateX(-5px)' },
        },
        floatSlow: {
          '0%, 100%': { transform: 'translateY(0px) translateX(0px) rotate(0deg)' },
          '25%': { transform: 'translateY(-30px) translateX(20px) rotate(1deg)' },
          '50%': { transform: 'translateY(-10px) translateX(-15px) rotate(-1deg)' },
          '75%': { transform: 'translateY(-25px) translateX(5px) rotate(0.5deg)' },
        },
        orbit: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      }
    }
  },
  plugins: [],
}

export default config