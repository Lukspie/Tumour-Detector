/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        mri: {
          950: "#04080f",
          900: "#070f1a",
          800: "#0d1928",
          700: "#132236",
          border: "#1a3050",
        },
      },
    },
  },
  plugins: [],
};
  