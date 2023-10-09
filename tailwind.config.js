/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js}"],
  theme: {
    extend: {
      colors: {
        'ban': '#333',
        'title': '#f65c65',
        'subtitle': '#000',
        'todowrap': '#f4f7fc',
        'add': '#ddd',
        'addcolor': '#fefefe',
      },
    },
  },
  plugins: [],
}

