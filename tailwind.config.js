const defaultTheme = require('tailwindcss/defaultTheme');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./pages/**/*.{js,jsx,ts,tsx}', './components/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        'brand-black': '#050509',
        'brand-void': '#020203',
        'brand-orange': '#E8540E',
        'brand-blue': '#0D5BA3',
        'brand-teal': '#28A1BB',
        'brand-white': '#F5F7FA',
        'brand-slate': '#1E2233',
        'brand-ice': '#ECF3FF',
        'brand-glass': 'rgba(255, 255, 255, 0.68)',
      },
      fontFamily: {
        sans: ['"Inter"', ...defaultTheme.fontFamily.sans],
        display: ['"JetBrains Mono"', '"Inter"', ...defaultTheme.fontFamily.sans],
      },
      transitionTimingFunction: {
        apple: 'cubic-bezier(0.25, 0.1, 0.25, 1)',
      },
    },
  },
  plugins: [],
};
