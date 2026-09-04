/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Institutional African Deep Blue
        navy: {
          50: '#F0F4F8',
          100: '#D9E2EC',
          200: '#BCCCDC',
          300: '#9FB3C8',
          400: '#829AB1',
          500: '#627D98',
          600: '#486581',
          700: '#334E68',
          800: '#1D3557',
          850: '#152642',
          900: '#0B1728',
          950: '#070F1C',
        },
        // Mobira Gold / African Fintech Yellow
        yellow: {
          50: '#FEFCE8',
          100: '#FEF9C3',
          200: '#FEF08A',
          300: '#FDE047',
          400: '#FACC15',
          500: '#EAB308',
          600: '#CA8A04',
          700: '#A16207',
          800: '#854D0E',
          900: '#713F12',
          950: '#422006',
        },
        // Financial Trust Colors
        brand: {
          blue: '#0B1728',
          'blue-light': '#152642',
          yellow: '#F59E0B',
          'yellow-light': '#FACC15',
          'yellow-hover': '#D97706',
        },
      },
      boxShadow: {
        'subtle': '0 1px 3px 0 rgba(11, 23, 40, 0.05), 0 1px 2px 0 rgba(11, 23, 40, 0.03)',
        'elevated': '0 4px 6px -1px rgba(11, 23, 40, 0.08), 0 2px 4px -1px rgba(11, 23, 40, 0.04)',
        'modal': '0 20px 25px -5px rgba(11, 23, 40, 0.25), 0 10px 10px -5px rgba(11, 23, 40, 0.1)',
      },
    },
  },
  plugins: [],
};
