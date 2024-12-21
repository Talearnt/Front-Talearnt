export default {
  content: ["./src/**/*.tsx"],
  theme: {
    extend: {
      colors: {
        "talearnt-blue": {
          10: "#F0F6FF",
          20: "#E5F0FF",
          30: "#B2D1FF",
          40: "#80B2FF",
          50: "#4D94FF",
          60: "#1B76FF",
          70: "#005CE5",
          80: "#0047B2",
          90: "#001F4D",
          100: "#001F4D"
        },
        "talearnt-red": {
          10: "#FFF0F0",
          20: "#FFE5E5",
          30: "#FFC2C2",
          40: "#FF8F8F",
          50: "#FF5C5C",
          60: "#FF2727",
          70: "#F50000",
          80: "#C20000",
          90: "#8F0000",
          100: "#5C0000"
        },
        "talearnt-gray": {
          10: "#F7F8F8",
          20: "#ECEEEF",
          30: "#DEE1E3",
          40: "#D0D5D8",
          50: "#C1C8CC",
          60: "#A6B0B5",
          70: "#98A3A9",
          80: "#58646A",
          90: "#414A4E",
          100: "#1E2224"
        },
        "talearnt-BG_Background": "#FFFFFF",
        "talearnt-BG_Black_01": "rgba(0, 0, 0, 0.7)",
        "talearnt-BG_Black_02": "rgba(0, 0, 0, 0.8)",
        "talearnt-BG_Up_01": "#F7F8F8",
        "talearnt-BG_Up_02": "#ECEEEF",
        "talearnt-BG_Up_03": "#DEE1E3",
        "talearnt-Primary_01": "#1B76FF",
        "talearnt-PrimaryBG_01": "#E5F0FF",
        "talearnt-PrimaryBG_02": "#4D94FF",
        "talearnt-Error_01": "#FF2727",
        "talearnt-Error_02": "#F50000",
        "talearnt-Error_03": "#FF5C5C",
        "talearnt-ErrorBG_01": "#FFF0F0",
        "talearnt-Text_Strong": "#000000",
        "talearnt-Text_01 ": "#1E2224",
        "talearnt-Text_02": "#414A4E",
        "talearnt-Text_03": "#98A3A9",
        "talearnt-Text_04": "#A6B0B5",
        "talearnt-Icon_01": "#414A4E",
        "talearnt-Icon_02": "#C1C8CC",
        "talearnt-Icon_03": "#DEE1E3",
        "talearnt-Line_01": "#D0D5D8"
      },
      fontFamily: {
        pretendard: ["Pretendard", "sans-serif"]
      },
      animation: {
        "spinner-spin": "spinner-spin 1s linear infinite",
        "fade-in": "fade-in 0.5s ease-in-out",
        "fade-out": "fade-out 0.5s ease-in-out"
      },
      keyframes: {
        "spinner-spin": {
          from: { transform: "rotate(0deg)" },
          to: { transform: "rotate(-360deg)" }
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" }
        },
        "fade-out": {
          "0%": { opacity: "1" },
          "100%": { opacity: "0" }
        }
      }
    }
  },
  plugins: []
};
