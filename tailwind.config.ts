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
      },
    },
  },
  plugins: [],
};
export default config;
