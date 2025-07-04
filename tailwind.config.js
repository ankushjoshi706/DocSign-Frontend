import forms from "@tailwindcss/forms";
import typography from "@tailwindcss/typography";

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  darkMode: false, // explicitly turn off dark mode
  theme: {
    extend: {
      colors: {
        primary: "#004aad", // brand blue
        accent: "#e11d48",  // soft red
        surface: "#ffffff",
        muted: "#f5f7fa",
        border: "#e2e8f0",
        text: "#1f2937",
        subtle: "#6b7280",

        brand: {
        light: '#f0f4ff',
        DEFAULT: '#6366f1',
        dark: '#4338ca',
      },
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
        signature: ['"Dancing Script"', "cursive"],
        pacifico: ['"Pacifico"', "cursive"],
        satisfy: ['"Satisfy"', "cursive"],
      },
      boxShadow: {
        card: "0 4px 14px rgba(0, 0, 0, 0.06)",
        button: "0 2px 6px rgba(0, 0, 0, 0.08)",
        input: "0 1px 3px rgba(0, 0, 0, 0.04)",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: 0 },
          "100%": { opacity: 1 },
        },
        slideUp: {
          "0%": { opacity: 0, transform: "translateY(10px)" },
          "100%": { opacity: 1, transform: "translateY(0)" },
        },
        scaleUp: {
          "0%": { transform: "scale(0.95)", opacity: 0 },
          "100%": { transform: "scale(1)", opacity: 1 },
        },
      },
      animation: {
        fadeIn: "fadeIn 0.4s ease-out",
        slideUp: "slideUp 0.4s ease-out",
        scaleUp: "scaleUp 0.3s ease-in-out",
      },
      transitionTimingFunction: {
        'out-expo': 'cubic-bezier(0.19, 1, 0.22, 1)',
      },
      borderRadius: {
        xl: "1rem",
        "2xl": "1.5rem",
      },
    },
  },
  plugins: [
    forms({ strategy: "class" }),
    typography,
  ],
};
