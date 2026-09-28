/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,ts}'],
  theme: {
    extend: {
      colors: {
        forest: '#24352A',
        moss: '#66745B',
        ivory: '#F4EFE5',
        cream: '#E9E1D2',
        terracotta: '#A85C43',
        gold: '#B49A62',
        charcoal: '#272622',
        stone: '#817C70',
      },
      fontFamily: {
        display: ['"Cormorant Garamond"', 'serif'],
        sans: ['Inter', 'sans-serif'],
      },
      letterSpacing: {
        widest2: '0.2em',
      },
      transitionDuration: {
        400: '400ms',
        600: '600ms',
        800: '800ms',
      },
    },
  },
  plugins: [],
}
