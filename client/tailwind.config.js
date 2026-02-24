/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class', // или 'media' если хотим автоматически по системным настройкам
  theme: {
    extend: {},
  },
  plugins: [],
}