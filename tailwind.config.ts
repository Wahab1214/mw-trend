import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        surface: "var(--surface)",
        elevated: "var(--elevated)",
        border: "var(--border)",
        text: {
          primary: "var(--text-primary)",
          secondary: "var(--text-secondary)",
          muted: "var(--text-muted)",
        },
        gold: {
          DEFAULT: "var(--gold)",
          light: "var(--gold-light)",
          dark: "var(--gold-dark)",
        },
        status: {
          success: "#2E9D6B",
          warning: "#D98E04",
          danger: "#D64545",
          info: "#3B82C4",
        },
        accent: {
          pink: "#F4C6D0",
          lavender: "#D9CFF0",
        },
      },
      fontFamily: {
        serif: ["var(--font-serif)", "Playfair Display", "Cormorant Garamond", "serif"],
        sans: ["var(--font-sans)", "Inter", "system-ui", "sans-serif"],
        script: ["var(--font-script)", "cursive", "serif"],
      },
      boxShadow: {
        'gold-glow': '0 0 20px -3px rgba(201, 164, 76, 0.25)',
        'gold-glow-lg': '0 0 35px -5px rgba(201, 164, 76, 0.35)',
      },
      borderRadius: {
        'luxury': '0.75rem',
      },
    },
  },
  plugins: [],
};

export default config;
