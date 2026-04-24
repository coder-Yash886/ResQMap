/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        dark: {
          base: '#0A0F1A',
          surface: 'rgba(255, 255, 255, 0.05)',
          border: 'rgba(255, 255, 255, 0.1)',
        },
        accent: {
          primary: '#E8650A',
          secondary: '#1C3A5E',
        },
        status: {
          available: '#22C55E',
          allocated: '#F59E0B',
          completed: '#6B7280',
        },
        type: {
          food: '#22C55E',
          medicine: '#3B82F6',
          shelter: '#F59E0B',
          volunteer: '#A855F7',
          funds: '#E8650A',
        }
      },
      fontFamily: {
        syne: ['Syne', 'sans-serif'],
        sans: ['DM Sans', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
