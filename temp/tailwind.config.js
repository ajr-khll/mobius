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
      backgroundImage: {
        'brand-gradient':
          'linear-gradient(180deg, rgba(248,251,255,0.95) 0%, rgba(233,238,255,0.9) 35%, rgba(220,230,255,0.82) 70%, rgba(210,222,255,0.75) 100%)',
        'brand-glass':
          'linear-gradient(135deg, rgba(255,255,255,0.78) 0%, rgba(235,243,255,0.55) 100%)',
      },
      boxShadow: {
        'glass-lg': '0 24px 60px rgba(13, 91, 163, 0.25)',
        'glass-soft': '0 12px 32px rgba(232, 84, 14, 0.18)',
      },
      borderRadius: {
        '5xl': '2.5rem',
      },
      transitionTimingFunction: {
        apple: 'cubic-bezier(0.25, 0.1, 0.25, 1)',
        nav: 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
    },
  },
  plugins: [],
};
