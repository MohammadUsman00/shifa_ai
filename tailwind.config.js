/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['var(--font-display)'],
        body: ['var(--font-body)'],
        mono: ['var(--font-mono)'],
      },
      colors: {
        sage: {
          50: '#f4f7f4',
          100: '#e3ece3',
          200: '#c8d9c9',
          300: '#a0bda2',
          400: '#739b76',
          500: '#527d56',
          600: '#3f6343',
          700: '#344f37',
          800: '#2b402e',
          900: '#243527',
        },
        cream: {
          50: '#fdfcf8',
          100: '#faf7ef',
          200: '#f3eddc',
          300: '#e9dfc3',
          400: '#dccda4',
          500: '#cab87e',
        },
        slate: {
          warm: '#8b8b8b',
        }
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'pulse-slow': 'pulse 4s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-12px)' },
        }
      }
    },
  },
  plugins: [],
}
