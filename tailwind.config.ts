import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        mainBlack: '#1b1b1b',
        mainText: '#cccccc',
        mainGold: '#8b5a1d',
        subGold: '#a76a1f80',
        redLineColor: '#ff2d2db1',
        blueLineColor: '#2d3bffb0',
      },
      keyframes: {
        fillLeftHalf: {
          '0%': { width: '70%', transform: 'translateX(70%)' },
          '100%': { width: '100%', transform: 'translateX(0)' },
        },
        fillRightHalf: {
          '0%': { width: '70%', transform: 'translateX(-70%)' },
          '100%': { width: '100%', transform: 'translateX(0)' },
        },
      },
      animation: {
        'fill-left-half': 'fillLeftHalf 1s linear infinite',
        'fill-right-half': 'fillRightHalf 1s linear infinite',
      },
    },
  },
  plugins: [],
};
export default config;
