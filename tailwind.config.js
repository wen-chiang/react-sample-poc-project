/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          600: '#667eea',
          700: '#5568d3',
        },
        secondary: '#764ba2',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}
