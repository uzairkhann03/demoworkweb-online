/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'playfair': ['"Playfair Display"', 'serif'],
        'inter': ['Inter', 'sans-serif'],
      },
      colors: {
        primary: '#1A1A1A',
        accent: '#10B981',
        'soft-gray': '#F5F5F5',
        'warm-beige': '#F9F6F2',
        gold: '#D4AF37',
      },
    },
  },
  plugins: [],
}
