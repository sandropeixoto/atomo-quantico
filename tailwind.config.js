/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'quantum-blue': '#007BFF',
        'quantum-violet': '#8A2BE2',
      }
    },
  },
  plugins: [],
}