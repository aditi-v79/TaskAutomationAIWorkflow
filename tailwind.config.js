
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: 'var(--primary)',
          dark: 'var(--primary-dark)',
        },
        secondary: 'var(--secondary)',
        background: 'var(--background)',
        surface: 'var(--surface)',
        border: 'var(--border)',
      },
    },
  },
  plugins: [],
}