import theme from './src/config/theme.json' with { type: 'json' };

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: { ...theme.colors },
      fontFamily: {
        display: ['"Bricolage"', '"Arial Narrow"', 'Impact', 'sans-serif'],
        body: ['"Inter Tight"', 'system-ui', 'sans-serif'],
      },
      screens: { xs: '400px', '3xl': '1680px' },
      transitionTimingFunction: {
        expo: 'cubic-bezier(0.16, 1, 0.3, 1)',
        power3: 'cubic-bezier(0.215, 0.61, 0.355, 1)',
      },
    },
  },
  plugins: [],
};
