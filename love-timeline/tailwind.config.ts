import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/lib/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-outfit)'],
        display: ['var(--font-clash-display)'],
        mono: ['var(--font-jetbrains-mono)'],
        hand: ['var(--font-gloria-hallelujah)'],
        pen: ['var(--font-nanum-pen-script)'],
      },
      colors: {
        cream: '#FFF9F5',
        coral: '#FF6B6B',
        slate: '#4D5061',
        pastel: {
            pink: '#FFD6E0',
            blue: '#C4E4F7',
            yellow: '#FEF9C3',
            mint: '#D1FAE5',
            lavender: '#E9D5FF'
        },
        rose: { 50: '#fff1f2', 100: '#ffe4e6', 200:'#fecdd3', 300: '#fda4af', 400:'#fb7185', 500: '#f43f5e', 900: '#881337' }
      },
      animation: {
        'float': 'float 8s ease-in-out infinite',
        'float-slow': 'float 12s ease-in-out infinite',
        'pulse-slow': 'pulse 3s infinite',
      },
      keyframes: {
          float: {
              '0%, 100%': { transform: 'translateY(0) rotate(var(--rot))' },
              '50%': { transform: 'translateY(-20px) rotate(var(--rot))' },
          }
      }
    },
  },
  plugins: [require('tailwindcss-animate')],
};
export default config;
