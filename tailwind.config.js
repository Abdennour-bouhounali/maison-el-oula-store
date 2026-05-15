/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        nature: {
          green: {
            DEFAULT: '#4A5D23',
            dark: '#3A4A1C',
            light: '#6B813D',
          },
          beige: {
            DEFAULT: '#F2E8D5',
            dark: '#E5D5B8',
            light: '#F9F4EB',
          },
          white: '#FDFBF7',
          lemon: '#EFD26E',
          orange: '#E8A85D',
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        arabic: ['Noto Sans Arabic', 'sans-serif'],
      },
      borderRadius: {
        'premium': '2rem',
        'premium-sm': '1rem',
      },
      boxShadow: {
        'premium': '0 10px 40px -10px rgba(74, 93, 35, 0.1)',
        'premium-hover': '0 20px 60px -15px rgba(74, 93, 35, 0.15)',
      }
    },
  },
  plugins: [],
}
