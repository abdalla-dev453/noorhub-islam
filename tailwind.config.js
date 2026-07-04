/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", // This ensures all files in components/ and pages/ get styled
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
