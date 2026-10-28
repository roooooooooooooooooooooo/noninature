import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        forest: {
          DEFAULT: '#124B2A',
          50: '#F2F8F4',
          100: '#E1EFE7',
          200: '#C2DFD0',
          300: '#94C7AE',
          400: '#5FA987',
          500: '#3D8C67',
          600: '#2C7051',
          700: '#235941',
          800: '#1A4533',
          900: '#124B2A',
          950: '#0B2D19',
        },
        leaf: {
          DEFAULT: '#287A3D',
          light: '#3DA358',
          dark: '#1C592C',
        },
        ivory: {
          DEFAULT: '#FAF7EA',
          light: '#FEFCF5',
          dark: '#EDE7D1',
        },
        gold: {
          DEFAULT: '#D4A72C',
          light: '#E5C058',
          dark: '#A68019',
        },
        botanicalDark: '#193526',
      },
      fontFamily: {
        sans: ['system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

export default config;
