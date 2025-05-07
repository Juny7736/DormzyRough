/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#A9BE93',
          dark: '#8CA578',
          light: '#C4D7B2'
        }
      }
    },
  },
  plugins: [],
};