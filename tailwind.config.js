export default {
  content: ["./src/**/*.tsx"],
  theme: {
    extend: {
      colors: {
        "talearnt-primary": "#1B76FF",
        "talearnt-blue": {
          100: "#E5F0FF",
          200: "#B2D1FF",
          300: "#80B2FF",
          400: "#4D94FF",
          500: "#1B76FF",
          600: "#005CE5",
          700: "#0047B2",
          800: "#003380",
          900: "#001F4D"
        },
        "talearnt-red": {
          100: "#FFF5F5",
          200: "#FFC2C2",
          300: "#FF8F8F",
          400: "#FF5C5C",
          500: "#FF2727",
          600: "#F50000",
          700: "#C20000",
          800: "#8F0000",
          900: "#5C0000"
        },
        "talearnt-gray": {
          50: "#F7F7F7",
          100: "#EDEDED",
          200: "#E0E0E0",
          300: "#D4D4D4",
          400: "#C7C7C7",
          500: "#ADADAD",
          600: "#7A7A7A",
          700: "#616161",
          800: "#474747",
          900: "#212121"
        },
        button: {
          primary: "#1B76FF",
          disabled: "#EDEDED",
          hover: "#4D94FF"
        },
        text: {
          black: "#212121",
          gray: "#7A7A7A",
          disabled: "#ADADAD",
          point: "#1B76FF",
          blue: "#4D94FF",
          error: "#FF2727",
          red: "#FF5C5C"
        }
      }
    }
  },
  plugins: []
};
