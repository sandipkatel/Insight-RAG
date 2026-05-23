import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-body)", "Georgia", "serif"],
        mono: ["var(--font-mono)", "Courier New", "monospace"],
        display: ["var(--font-display)", "Georgia", "serif"],
      },
      colors: {
        ink: {
          DEFAULT: "#1a1a2e",
          light: "#2d2d4e",
        },
        paper: {
          DEFAULT: "#f5f0e8",
          dark: "#ede8df",
          darker: "#e0d9ce",
        },
        accent: {
          DEFAULT: "#c94f2e",
          light: "#e0654a",
          dark: "#a03820",
        },
        teal: {
          rag: "#1a6b6b",
          light: "#2a8a8a",
        },
        amber: {
          warm: "#d4820a",
        },
      },
      animation: {
        "fade-in": "fadeIn 0.4s ease forwards",
        "slide-up": "slideUp 0.4s ease forwards",
        "pulse-soft": "pulseSoft 2s ease-in-out infinite",
        typing: "typing 1.2s steps(3, end) infinite",
      },
      keyframes: {
        fadeIn: {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        slideUp: {
          from: { opacity: "0", transform: "translateY(12px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        pulseSoft: {
          "0%, 100%": { opacity: "0.6" },
          "50%": { opacity: "1" },
        },
        typing: {
          "0%": { content: "''" },
          "33%": { content: "'.'" },
          "66%": { content: "'..'" },
          "100%": { content: "'...'" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
