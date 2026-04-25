/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        navy: {
          800: "#0f172a",
          900: "#0a1020",
        },
      },
    },
  },
  plugins: [],
};
