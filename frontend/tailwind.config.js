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
        // Deep Midnight & Institutional Oceanic Blue
        navy: {
          50: '#F0F6FC',
          100: '#D9E8F5',
          200: '#B3D0EC',
          300: '#85B2DE',
          400: '#548EC9',
          500: '#316EB0',
          600: '#215391',
          700: '#193F71',
          800: '#112A4F',
          850: '#0C1F3A',
          900: '#08162B',
          950: '#040C18',
        },
        // Vibrant Electric Emerald & Forest Green
        emerald: {
          50: '#ECFDF5',
          100: '#D1FAE5',
          200: '#A7F3D0',
          300: '#6EE7B7',
          400: '#34D399',
          500: '#10B981',
          600: '#059669',
          700: '#047857',
          800: '#065F46',
          900: '#064E3B',
          950: '#022C22',
        },
        // Crisp Electric Accent Blues
        accent: {
          blue: '#38BDF8',
          cyan: '#06B6D4',
          sky: '#0EA5E9',
          ice: '#BAE6FD',
        },
        // Primary Brand tokens
        brand: {
          emerald: '#10B981',
          'emerald-light': '#34D399',
          'emerald-hover': '#059669',
          'emerald-glow': 'rgba(16, 185, 129, 0.35)',
          deep: '#040C18',
          surface: '#08162B',
          card: '#0C1F3A',
          border: '#193F71',
          blue: '#38BDF8',
        },
      },
      boxShadow: {
        'subtle': '0 1px 3px 0 rgba(4, 12, 24, 0.08), 0 1px 2px 0 rgba(4, 12, 24, 0.05)',
        'elevated': '0 4px 12px -2px rgba(4, 12, 24, 0.25), 0 2px 6px -1px rgba(4, 12, 24, 0.15)',
        'modal': '0 25px 50px -12px rgba(4, 12, 24, 0.5)',
        'emerald': '0 0 20px -3px rgba(16, 185, 129, 0.35)',
        'emerald-lg': '0 0 35px -5px rgba(16, 185, 129, 0.45)',
      },
    },
  },
  plugins: [],
};
