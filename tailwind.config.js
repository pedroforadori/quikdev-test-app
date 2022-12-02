/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.tsx'
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: 'Roboto, sans-serif'
      },
      backgroundImage: {
        app: 'url(/bg.png)'
      },
      colors: {
        custom: {
          200: "#B5A6DC",
        }
      }
    },
  },
  plugins: [],
}
