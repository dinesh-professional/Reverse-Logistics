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
        background: '#F8F9FA',
        surface: {
          DEFAULT: '#FFFFFF',
          card: '#FFFFFF',
          border: '#E2E8F0',
          hover: '#F1F5F9',
        },
        primary: {
          DEFAULT: '#FC8019',
          hover: '#E56F0D',
          light: '#FFF3EB',
          glow: 'rgba(252, 128, 25, 0.25)',
        },
        swiggy: {
          orange: '#FC8019',
          'orange-hover': '#E56F0D',
          'orange-light': '#FFF3EB',
          green: '#60B246',
          'green-bg': '#F0FDF4',
          red: '#E23744',
          'red-bg': '#FEF2F2',
          amber: '#F59E0B',
          dark: '#0F172A',
          slate: '#475569',
        },
        risk: {
          high: '#E23744',
          'high-bg': '#FEF2F2',
          medium: '#F59E0B',
          'medium-bg': '#FFFBEB',
          low: '#60B246',
          'low-bg': '#F0FDF4',
        }
      },
      boxShadow: {
        'glass': '0 10px 30px 0 rgba(0, 0, 0, 0.05)',
        'orange-glow': '0 4px 14px 0 rgba(252, 128, 25, 0.35)',
        'green-glow': '0 4px 14px 0 rgba(96, 178, 70, 0.35)',
        'red-glow': '0 4px 14px 0 rgba(226, 55, 68, 0.35)',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      animation: {
        'pulse-glow': 'pulseGlow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'scan-radar': 'scanRadar 3s linear infinite',
      },
      keyframes: {
        pulseGlow: {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.6', transform: 'scale(1.03)' },
        },
        scanRadar: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100%)' },
        }
      }
    }
  },
  plugins: [],
}

export default config
