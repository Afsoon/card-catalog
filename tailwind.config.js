module.exports = {
  purge: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
  darkMode: false,
  theme: {
    extend: {
      spacing: {
        imgWidth: "128px",
        imgHeight: "192px",
      },
    },
  },
  variants: {},
  plugins: [require("@tailwindcss/forms")],
}
