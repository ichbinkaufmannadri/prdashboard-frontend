import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: '#0f1114',
        surface: '#171a1f',
        elevated: '#1e2229',
        border: '#262b33',
        'border-hover': '#363c46',
        text: '#e8e6e0',
        muted: '#8a8e97',
        subtle: '#5a5e66',
        accent: {
          DEFAULT: '#ffb454',
          hover: '#ffc574',
          dim: 'rgba(255, 180, 84, 0.12)',
        },
        success: '#7ec97e',
        danger: '#e56b6f',
        warning: '#e4c589',
        github: '#c9d1d9',
        gitlab: '#fc6d26',
        status: {
          open: '#7ec97e',
          draft: '#8a8e97',
          merged: '#a374f0',
          closed: '#e56b6f',
        },
      },
      fontFamily: {
        sans: ['Space Grotesk', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'ui-monospace', 'monospace'],
      },
      fontSize: {
        '2xs': '0.6875rem',
      },
      animation: {
        'blink': 'blink 1.1s step-end infinite',
        'fade-in': 'fadeIn 200ms ease-out',
      },
      keyframes: {
        blink: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0' },
        },
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(4px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
} satisfies Config;
