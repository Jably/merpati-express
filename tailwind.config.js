const defaultTheme = require('tailwindcss/defaultTheme')

const fontFamily = defaultTheme.fontFamily;
fontFamily['sans'] = [
  'Montserrat', // <-- Roboto is a default sans font now
];

module.exports = {
    content: [
      "./src/app/**/*.{js,ts,jsx,tsx}",
      "./src/components/**/*.{js,ts,jsx,tsx}",
    ],

    
    theme: {
      fontFamily: fontFamily,
      extend: {
        colors: {
          primary: "#2563EB", // misal untuk tombol utama
          secondary: "#1E293B",
        },
        // fontFamily: {
        //   montserrat: ['Montserrat'], // align with globals.css font import
        // },
      },
    },
    plugins: [],
  };
