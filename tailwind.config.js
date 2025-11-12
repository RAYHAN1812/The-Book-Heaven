
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx,css}", 
  ],
  theme: {
    extend: {
      colors: {
        primary: "#1d4ed8", 
      },
    },
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: ["light", "dark"],
    darkTheme: "light",
  },
};
