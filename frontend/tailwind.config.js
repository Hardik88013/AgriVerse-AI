/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#10B981", // Emerald green for agriculture
        secondary: "#047857", // Darker green
        dark: "#1F2937",
        light: "#F9FAFB"
      }
    },
  },
  plugins: [],
}
