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
      screens: {
        'xs': '420px',
      },
      colors: {
        // Deep Charcoal & Institutional Dark Slate
        navy: {
          50: '#F8FAFC',
          100: '#F1F5F9',
          200: '#E2E8F0',
          300: '#CBD5E1',
          400: '#94A3B8',
          500: '#64748B',
          600: '#475569',
          700: '#334155',
          800: '#1E293B',
          850: '#18222D',
          900: '#131B24',
          950: '#0F172A',
        },
        // Electric Lime & Green Accent Theme
        emerald: {
          50: '#F7FEE7',
          100: '#ECFCCB',
          200: '#D9F99D',
          300: '#BEF264',
          400: '#A3E635',
          500: '#84CC16',
          600: '#65A30D',
          700: '#4D7C0F',
          800: '#3F6212',
          900: '#365314',
          950: '#1A2E05',
        },
        lime: {
          300: '#BEF264',
          400: '#A3E635',
          500: '#84CC16',
          600: '#65A30D',
          700: '#4D7C0F',
        },
        // Electric Accent Blues
        accent: {
          blue: '#38BDF8',
          electric: '#2563EB',
          cyan: '#06B6D4',
          sky: '#0EA5E9',
          ice: '#BAE6FD',
        },
        // Primary Brand tokens
        brand: {
          lime: '#A3E635',
          'lime-light': '#BEF264',
          'lime-hover': '#84CC16',
          'lime-glow': 'rgba(163, 230, 53, 0.35)',
          deep: '#0F172A',
          charcoal: '#131B24',
          surface: '#18222D',
          card: '#1E293B',
          border: '#334155',
          blue: '#2563EB',
        },
      },
      boxShadow: {
        'subtle': '0 1px 3px 0 rgba(15, 23, 42, 0.08), 0 1px 2px 0 rgba(15, 23, 42, 0.05)',
        'elevated': '0 4px 12px -2px rgba(15, 23, 42, 0.25), 0 2px 6px -1px rgba(15, 23, 42, 0.15)',
        'modal': '0 25px 50px -12px rgba(15, 23, 42, 0.6)',
        'lime': '0 0 20px -3px rgba(163, 230, 53, 0.35)',
        'lime-lg': '0 0 35px -5px rgba(163, 230, 53, 0.45)',
        'emerald': '0 0 20px -3px rgba(163, 230, 53, 0.35)',
        'emerald-lg': '0 0 35px -5px rgba(163, 230, 53, 0.45)',
      },
    },
  },
  plugins: [],
};
