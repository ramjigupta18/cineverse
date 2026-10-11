/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cinema: {
          bg: "#09090B",
          card: "#18181B",
          accent: "#F97316",
        },
      },
      boxShadow: {
        glow: "0 0 30px rgba(249, 115, 22, 0.15)",
      },
    },
  },
  plugins: [],
};
