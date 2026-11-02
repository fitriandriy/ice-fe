/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js}"],
  theme: {
    extend: {},
  },
  plugins: [
    function({ addVariant }) {
      addVariant('calendar-icon', '&::-webkit-calendar-picker-indicator');
    }
  ],
}

