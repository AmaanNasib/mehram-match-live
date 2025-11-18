/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        'button-default': 'linear-gradient(to right, #FF59B6, #EB53A7)',
        'button-hover': 'linear-gradient(to right, #F971BC, #DA73AD)',
      },
      colors: {
        "neongreen": "#D1F60A",
        "pink-mm": "#FF59B6"
      },
    },
  },
  plugins: [],

}