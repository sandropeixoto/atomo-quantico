/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    colors: {
      primary: '#F0F4F8',
      secondary: '#FFDAB9',
      accent: '#E6E6FA',
      'text-primary': '#333333',
      'text-secondary': '#555555',
      background: '#FFFFFF',
    },
    fontFamily: {
      sans: ['Poppins', 'sans-serif'],
    },
  },
  plugins: [],
}
