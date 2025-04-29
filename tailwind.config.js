export default {
  content: ["./src/**/*.tsx"],
  safelist: [
    "rotate-90",
    "rotate-0",
    "rotate-180",
    "-rotate-90",
    "box-content"
  ],
  theme: {
    extend: {
      colors: {
        talearnt_BG_Background: "#FFFFFF",
        talearnt_BG_Background_01: "rgba(255, 255, 255, 0.2)",
        talearnt_BG_Toast_01: "rgba(0, 0, 0, 0.7)",
        talearnt_BG_Toast_02: "rgba(0, 0, 0, 0.8)",
        talearnt_BG_Up_01: "#F7F8F8",
        talearnt_BG_Up_02: "#ECEEEF",
        talearnt_BG_Up_03: "#DEE1E3",
        talearnt_BG_Badge_01: "#FFF0F0",
        talearnt_BG_Badge_02: "#FFE5E5",
        talearnt_On_Toast: "#FFFFFF",
        talearnt_Primary_01: "#1B76FF",
        talearnt_PrimaryBG_01: "#E5F0FF",
        talearnt_PrimaryBG_02: "#4D94FF",
        talearnt_PrimaryBG_03: "#80B2FF",
        talearnt_PrimaryBG_04: "#F0F6FF",
        talearnt_On_Primary: "#FFFFFF",
        talearnt_Error_01: "#FF2727",
        talearnt_Error_02: "#F50000",
        talearnt_Error_03: "#FF5C5C",
        talearnt_ErrorBG_01: "#FFF0F0",
        talearnt_ErrorBG_02: "rgba(255, 240, 240, 0.8)",
        talearnt_On_Error: "#FFFFFF",
        talearnt_Success_01: "#00CC70",
        talearnt_SuccessBG_01: "rgba(240, 255, 248, 0.8)",
        talearnt_On_Success: "#FFFFFF",
        talearnt_Text_Strong: "#000000",
        talearnt_Text_01: "#1E2224",
        talearnt_Text_02: "#414A4E",
        talearnt_Text_03: "#98A3A9",
        talearnt_Text_04: "#A6B0B5",
        talearnt_Text_Red: "#FF2727",
        talearnt_Icon_01: "#414A4E",
        talearnt_Icon_02: "#C1C8CC",
        talearnt_Icon_03: "#DEE1E3",
        talearnt_On_Icon: "#FFFFFF",
        talearnt_Line_01: "#D0D5D8",
        talearnt_Line_02: "#ECEEEF"
      },
      fontSize: {
        heading1_30_semibold: [
          "30px",
          { lineHeight: "1.3", fontWeight: "600" }
        ],
        heading2_24_semibold: [
          "24px",
          { lineHeight: "1.3", fontWeight: "600" }
        ],
        heading3_22_semibold: [
          "22px",
          { lineHeight: "1.3", fontWeight: "600" }
        ],
        heading4_20_semibold: [
          "20px",
          { lineHeight: "1.3", fontWeight: "600" }
        ],
        body1_18_semibold: ["18px", { lineHeight: "1.3", fontWeight: "600" }],
        body1_18_medium: ["18px", { lineHeight: "1.3", fontWeight: "500" }],
        body2_16_semibold: ["16px", { lineHeight: "1.5", fontWeight: "600" }],
        body2_16_medium: ["16px", { lineHeight: "1.5", fontWeight: "500" }],
        body3_14_semibold: ["14px", { lineHeight: "1.3", fontWeight: "600" }],
        body3_14_medium: ["14px", { lineHeight: "1.3", fontWeight: "500" }],
        caption1_14_medium: ["14px", { lineHeight: "1.3", fontWeight: "500" }],
        caption2_12_semibold: [
          "12px",
          { lineHeight: "1.3", fontWeight: "600" }
        ],
        caption2_12_medium: ["12px", { lineHeight: "1.3", fontWeight: "500" }],
        label1_10_semibold: ["10px", { lineHeight: "1.3", fontWeight: "600" }]
      },
      boxShadow: {
        shadow_02: "0 0 20px 0 rgba(0, 0, 0, 0.08)",
        shadow_03: "0 0 24px 0 rgba(0, 0, 0, 0.12)"
      },
      animation: {
        spinner_spin: "spinner_spin 0.8s linear infinite",
        fade_in: "fade_in 0.5s ease-in-out",
        fade_out: "fade_out 0.5s ease-in-out",
        mako_sad: "mako_sad 0.6s linear infinite",
        new_matching_article_slide:
          "new_matching_article_slide 0.5s ease-in-out",
        new_matching_article_reveal:
          "depth_drop 0.5s ease-out forwards, matching_article_border_flash 0.5s ease-in-out 0.5s forwards",
        new_community_article_slide:
          "new_community_article_slide 0.5s ease-out forwards, community_article_border_flash 0.5s ease-in-out 0.5s forwards"
      },
      keyframes: {
        spinner_spin: {
          from: { transform: "rotate(0deg)" },
          to: { transform: "rotate(-360deg)" }
        },
        fade_in: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" }
        },
        fade_out: {
          "0%": { opacity: "1" },
          "100%": { opacity: "0" }
        },
        mako_sad: {
          "0%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(15px)" },
          "100%": { transform: "translateY(30px)" }
        },
        new_matching_article_slide: {
          "0%": {
            transform: "translateX(-325px)"
          },
          "100%": {
            transform: "translateX(0)"
          }
        },
        depth_drop: {
          "0%": {
            transform: "scale(2)"
          },
          "100%": {
            transform: "scale(1)"
          }
        },
        matching_article_border_flash: {
          "0%": {
            borderColor: "#D0D5D8"
          },
          "50%": {
            borderColor: "#1B76FF"
          },
          "100%": {
            borderColor: "#D0D5D8"
          }
        },
        new_community_article_slide: {
          "0%": {
            transform: "translateY(-60px)"
          },
          "100%": {
            transform: "translateY(0)"
          }
        },
        community_article_border_flash: {
          "0%": {
            borderColor: "transparent"
          },
          "50%": {
            borderColor: "#1B76FF"
          },
          "100%": {
            borderColor: "transparent"
          }
        }
      }
    }
  },
  plugins: []
};
