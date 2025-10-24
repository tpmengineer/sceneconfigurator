import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        "brand-green": "#9ac940",
        "brand-green-dk": "#4e661f",
        "brand-green-lt": "#BBDB80",

        "brand-grey-lt": "#a4abbb",
        "brand-grey": "#424757",
        "brand-grey-dk": "#23262F",
        
        "swift-blue": "#83afae",
        "swift-pink": "#fec8bc",
        "swift-blue-dk": "#235f7d",
        "swift-bg": "#dce0d1",

        "brand-white": "#FFFFFF",
        "brand-black": "#333333",

        "pearl": "#FBFCF8",
        "eggshell": "#FFF9E3",
        "alice-blue":"#F0F8FF"
      },
      fontSize: {
        "xxs": '0.7rem',
        "xxl": '3rem',
      }
    },
  },
  plugins: [],
};
export default config;
