import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: ['class'],
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        pretendard: ['Pretendard', 'sans-serif'],
      },
      colors: {
        mainBlack: '#1b1b1b',
        mainText: '#cccccc',
        mainGold: '#8b5a1d',
        subGold: '#a76a1f80',
        redLineColor: '#ff2d2db1',
        blueLineColor: '#2d3bffb0',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        chart: {
          '1': 'hsl(var(--chart-1))',
          '2': 'hsl(var(--chart-2))',
          '3': 'hsl(var(--chart-3))',
          '4': 'hsl(var(--chart-4))',
          '5': 'hsl(var(--chart-5))',
        },
      },
      keyframes: {
        fillLeftHalf: {
          '0%': {
            width: '70%',
            transform: 'translateX(70%)',
          },
          '100%': {
            width: '100%',
            transform: 'translateX(0)',
          },
        },
        fillRightHalf: {
          '0%': {
            width: '70%',
            transform: 'translateX(-70%)',
          },
          '100%': {
            width: '100%',
            transform: 'translateX(0)',
          },
        },
      },
      animation: {
        'fill-left-half': 'fillLeftHalf 1s linear infinite',
        'fill-right-half': 'fillRightHalf 1s linear infinite',
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      pointerhover: {
        raw: '(hover: hover) and (pointer: fine)',
      },
    },
  },

  plugins: [require('tailwindcss-animate')],
};
export default config;
