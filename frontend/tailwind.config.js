/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'prime-black': '#1A1A1A', // Header & Teks Utama (AC-1.1)
        'prime-gold': '#C9A961',  // CTA, Highlight, Badge (AC-1.1)
        'prime-red': '#B33A3A',   // Status Urgent, Hover (AC-1.1)
        'prime-gray': '#F5F5F5',  // Card & Background Sekunder (AC-1.1)
      },
      fontFamily: {
        sans: ['Inter', 'Geist', 'sans-serif'], // Typography wajib (AC-1.1)
      }
    },
  },
  plugins: [],
}