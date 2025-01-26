import type { Config } from 'tailwindcss'

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors:{
        custYellow: "#F5FFEC",
        darkBg: "#3B3B3A",
      }
    },
  },
  plugins: [],
} satisfies Config

