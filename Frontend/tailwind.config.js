/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      backgroundColor: {
        'custom': '#EFEAD2',
        'richblack' : '#0D1321',
        'failred' : '#950E20'
      }
    },
  },
  plugins: [],
}

