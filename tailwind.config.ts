import type { Config } from "tailwindcss";

export default <Partial<Config>>{
  content: [],
  future: {
    hoverOnlyWhenSupported: true,
  },
  theme: {
    extend: {
      colors: {
        secondary: "#0066CC1A",
        white: {
          DEFAULT: "#ffffff",
          100: "#FFFFFF0F",
          200: "#FFFFFF1F",
          300: "#FFFFFF2E",
          400: "#FFFFFF66",
          500: "#FFFFFFA3",
          600: "#FFFFFFE0",
        },
        black: {
          DEFAULT: "#000000",
          100: "#0000000A",
          200: "#0000001A",
          300: "#00000024",
          400: "#00000066",
          500: "#00000099",
          600: "#000000E0",
        },
        "dark-blue": {
          DEFAULT: "#040520",
          100: "#0405200A",
          200: "#0405201A",
          300: "#04052024",
          400: "#04052066",
          500: "#04052099",
          600: "#040520E0",
        },
        blue: {
          DEFAULT: "#1D3068",
          100: "#1D30680A",
          200: "#1D30681A",
          300: "#1D306824",
          400: "#1D306866",
          500: "#1D306899",
          600: "#1D3068E0",
        },
        "light-blue": {
          DEFAULT: "#0066CC",
          100: "#0066CC0F",
          200: "#0066CC1A",
          300: "#0066CC24",
          400: "#0066CC66",
          500: "#0066CC99",
          600: "#0066CCCC",
        },
        "light-blue-dark": {
          DEFAULT: "#178FE0",
          100: "#178FE00F",
          200: "#178FE01A",
          300: "#178FE024",
          400: "#178FE066",
          500: "#178FE099",
          600: "#178FE0CC",
        },
      },
      screens: {
        xs: "360px",
        sm: "480px",
        md: "768px",
        lg: "1280px",
      },
      aspectRatio: {
        auto: "auto",
        square: "1 / 1",
        video: "16 / 9",
      },
    },
  },
};
