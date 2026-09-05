/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: { 950: "#0a0e14", 900: "#0f141d", 800: "#161d29", 700: "#1f2937" },
        accent: { 300: "#9db8ff", 400: "#7c9aff", 500: "#5b7cfa", 600: "#4563e0" },
        mint: "#7ef0c1"
      },
      fontFamily: { sans: ["Inter", "system-ui", "sans-serif"] },
      boxShadow: { soft: "0 8px 40px -12px rgba(0,0,0,.6)", card: "0 1px 0 rgba(255,255,255,.06), 0 12px 32px -16px rgba(0,0,0,.7)" }
    }
  },
  plugins: []
};
