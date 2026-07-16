/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // A quiet, study-room palette: warm parchment in light mode,
        // deep ink/charcoal in dark mode, with a muted brass accent.
        ink: {
          50: '#f6f5f2',
          100: '#e9e6df',
          200: '#d3cec2',
          300: '#b3ab99',
          400: '#8f8570',
          500: '#726a57',
          600: '#5a5344',
          700: '#464033',
          800: '#2c2820',
          900: '#1c1913',
          950: '#111009',
        },
        brass: {
          300: '#d8bd82',
          400: '#c9a75c',
          500: '#b98f3e',
          600: '#9a7430',
          700: '#7a5b28',
        },
      },
      fontFamily: {
        serif: ['Georgia', 'Cambria', 'Times New Roman', 'serif'],
        sans: ['ui-sans-serif', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 2px 8px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.06)',
        'soft-dark': '0 2px 12px rgba(0,0,0,0.4)',
      },
    },
  },
  plugins: [],
};
