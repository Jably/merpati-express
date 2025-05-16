module.exports = {
    content: [
      "./src/app/**/*.{js,ts,jsx,tsx}",
      "./src/components/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
      extend: {
        colors: {
          primary: "#2563EB", // misal untuk tombol utama
          secondary: "#1E293B",
        },
        fontFamily: {
          montserrat: ['Montserrat', 'sans-serif'],
          sans: ['Montserrat', 'sans-serif'], // align with globals.css font import
        },
      },
    },
    plugins: [],
  };
