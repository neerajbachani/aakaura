import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
       fontFamily: {
        'cormorant': ['var(--font-cormorant-garamond)'],
      },
      colors: {
        primaryRed: "#A61200",
        primaryBrown: "#764640",
        primaryBeige: "#ffe5b6",
        secondaryBeige: "#f9e4c9",
      },
      keyframes: {
        rotateGradient: {
          from: { transform: "rotate(0deg)" },
          to: { transform: "rotate(360deg)" },
        },
        spin: {
          from: { transform: "rotate(0deg)" },
          to: { transform: "rotate(360deg)" },
        },
      },
      animation: {
        "spin-slow": "spin 20s linear infinite",
      },
    },
  },
  plugins: [],
} satisfies Config;
