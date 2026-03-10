import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#157f3c",
        "primary-dark": "#166534",
        secondary: "#e8761a",
        "background-light": "#fafaf8",
        "background-dark": "#122017",
        "surface-light": "#ffffff",
        "surface-dark": "#1a2e22",
        "accent-saffron": "#FF9933",
        // Legacy colors (keep for Admin dashboard compatibility if needed, or refactor later)
        navy: "#080d1a",
        navy2: "#0d1528",
        navy3: "#111e35",
        gold: "#c9a84c",
        gold2: "#e8c56a",
        cream: "#f0ece3",
        saffron: "#e8761a", // Duplicate of secondary, keeping for safety
        "charcoal-dark": "#0a0a0f",
        "charcoal-light": "#121218",
        "accent-red": "#ef4444",
        "accent-green": "#10b981",
      },
      fontFamily: {
        display: ["Public Sans", "sans-serif"],
        serif: ["Playfair Display", "serif"],
        body: ["Literata", "serif"],
        mono: ["DM Mono", "monospace"],
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
      },
      animation: {
        ticker: "ticker 40s linear infinite",
        shimmer: "shimmer 3s linear infinite",
      },
      keyframes: {
        ticker: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        shimmer: {
          to: { backgroundPosition: "200% center" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
