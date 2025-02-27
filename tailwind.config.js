import animatePlugin from 'tailwindcss-animate';

export default {
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        'font-1': ['"Roboto Condensed"', 'sans-serif'],
      },
    },
  },
  plugins: [animatePlugin],
};