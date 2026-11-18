import type { Config } from "tailwindcss";
import animate from "tailwindcss-animate";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        xs: "0 1px 2px 0 rgb(9 9 11 / 0.04)",
        card: "0 1px 3px 0 rgb(9 9 11 / 0.05), 0 8px 24px -12px rgb(9 9 11 / 0.12)",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "fade-up": "fade-up 420ms ease-out both",
      },
    },
  },
  plugins: [animate],
} satisfies Config;
