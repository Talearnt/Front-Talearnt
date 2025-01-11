export default {
  content: ["./src/**/*.tsx"],
  theme: {
    extend: {
      colors: {
        "talearnt-BG_Background": "#FFFFFF",
        "talearnt-BG_Background_01": "rgba(255, 255, 255, 0.2)",
        "talearnt-BG_Toast_01": "rgba(0, 0, 0, 0.7)",
        "talearnt-BG_Toast_02": "rgba(0, 0, 0, 0.8)",
        "talearnt-On_Toast": "#FFFFFF",
        "talearnt-Primary_01": "#1B76FF",
        "talearnt-PrimaryBG_01": "#E5F0FF",
        "talearnt-PrimaryBG_02": "#4D94FF",
        "talearnt-PrimaryBG_03": "#80B2FF",
        "talearnt-On_Primary": "#FFFFFF",
        "talearnt-Error_01": "#FF2727",
        "talearnt-Error_02": "#F50000",
        "talearnt-Error_03": "#FF5C5C",
        "talearnt-ErrorBG_01": "#FFF0F0",
        "talearnt-ErrorBG_02": "rgba(255, 240, 240, 0.8)",
        "talearnt-On_Error": "#FFFFFF",
        "talearnt-Success_01": "#00CC70",
        "talearnt-SuccessBG_01": "rgba(240, 255, 248, 0.8)",
        "talearnt-On_Success": "#FFFFFF",
        "talearnt-Text_Strong": "#000000",
        "talearnt-Text_01": "#1E2224",
        "talearnt-Text_02": "#414A4E",
        "talearnt-Text_03": "#98A3A9",
        "talearnt-Text_04": "#A6B0B5",
        "talearnt-Icon_01": "#414A4E",
        "talearnt-Icon_02": "#C1C8CC",
        "talearnt-Icon_03": "#DEE1E3",
        "talearnt-On_Icon": "#FFFFFF",
        "talearnt-Line_01": "#D0D5D8",
        "talearnt-BG_Up_01": "#F7F8F8",
        "talearnt-BG_Up_02": "#ECEEEF",
        "talearnt-BG_Up_03": "#DEE1E3"
      },
      fontFamily: {
        pretendard: ["Pretendard", "sans-serif"]
      },
      animation: {
        "spinner-spin": "spinner-spin 0.8s linear infinite",
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
