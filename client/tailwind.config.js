/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      colors: {
        brand: {
          50: "#f0f4ff",
          100: "#dde5ff",
          200: "#c0ceff",
          300: "#94a8ff",
          400: "#6079ff",
          500: "#3d52ff",
          600: "#2630f5",
          700: "#1d22e0",
          800: "#1b1eb5",
          900: "#1c208f",
          950: "#111355",
        },
        surface: {
          900: "#0d0f1e",
          800: "#13162b",
          700: "#1a1e38",
          600: "#222745",
          500: "#2c3157",
        },
      },
      backgroundImage: {
        "gradient-brand":
          "linear-gradient(135deg, #3d52ff 0%, #8b5cf6 100%)",
        "gradient-success":
          "linear-gradient(135deg, #10b981 0%, #059669 100%)",
        "gradient-danger":
          "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)",
        "gradient-warning":
          "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
      },
      animation: {
        "fade-in": "fadeIn 0.3s ease-out",
        "slide-up": "slideUp 0.3s ease-out",
        "slide-down": "slideDown 0.25s ease-out",
        pulse: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
      keyframes: {
        fadeIn: {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        slideUp: {
          from: { opacity: "0", transform: "translateY(20px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        slideDown: {
          from: { opacity: "0", transform: "translateY(-10px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
};
