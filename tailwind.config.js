/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: "#F8F9FA",
        surface: "#FFFFFF",
        primary: "#2D3436",
        secondary: "#636E72",
        accent: "#00CEC9",
        soft: "#DFE6E9",
        textprimary: "#1E272E",
        textsecondary: "#718093",
        border: "#DCDDE1",
      },
      fontFamily: {
        prompt: ["Prompt", "sans-serif"],
      },
      borderRadius: {
        "2xl": "1rem",
        "3xl": "1.5rem",
      },
    },
  },
  plugins: [],
};
