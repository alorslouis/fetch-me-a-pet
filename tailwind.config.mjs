/** @type {import('tailwindcss').Config} */
const plugin = require("tailwindcss/plugin");

export default {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  theme: {
    extend: {
      offsetPath: {
        "quarter-circle": "path('M0,100 Q50,0 100,0')",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        enterIn: {
          "0%": { offsetDistance: "0%" },
          "100%": { offsetDistance: "100%" },
        },
      },
      animation: {
        fadeIn: "fadeIn 300ms ease-in-out",
        enterIn: "enterIn 300ms ease-out forwards",
      },
    },
  },
  plugins: [
    require("@tailwindcss/forms"),
    plugin(function ({ addVariant }) {
      addVariant("htmx-settling", ["&.htmx-settling", ".htmx-settling &"]);
      addVariant("htmx-request", ["&.htmx-request", ".htmx-request &"]);
      addVariant("htmx-swapping", ["&.htmx-swapping", ".htmx-swapping &"]);
      addVariant("htmx-added", ["&.htmx-added", ".htmx-added &"]);
    }),
    plugin(function ({ addUtilities }) {
      const newUtilities = {
        ".offset-path-quarter-circle": {
          offsetPath: "path('M-50,30 Q10,0 50,10')",
        },
      };
      addUtilities(newUtilities, ["responsive", "hover"]);
    }),
  ],
};
