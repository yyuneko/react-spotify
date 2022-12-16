module.exports = {
  content: ["./public/**.*.html","./src/**/*.tsx"],
  darkMode: false, // or 'media' or 'class'
  theme: {
    spacing: {
      "0": "0px",
      "4": "4px",
      "8": "8px",
      "14": "14px",
      "16": "16px",
      "18": "18px",
      "20": "20px",
      "24": "24px",
      "32": "32px",
      
    },
    extend: {},
  },
  variants: {},
  plugins: [
    require("tailwindcss"),
    require("autoprefixer")
  ],
};