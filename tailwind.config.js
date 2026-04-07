/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        bgDark: '#0f172a',       // slate-900
        cardDark: '#111827',     // gray-900
        borderDark: '#1f2937',   // gray-800
        textPrimary: '#cbd5e1',  // slate-300 (NOT white)
        textSecondary: '#94a3b8' // slate-400
      }
    },
  },
  plugins: [],
};
