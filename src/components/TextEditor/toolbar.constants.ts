type attributorsType = {
  whitelist: string[];
};
type quillIconsType = {
  bold: string | null;
  italic: string | null;
  underline: string | null;
  align: Record<"" | "center" | "right", string> | null;
  color: string | null;
  background: string | null;
  link: string | null;
  image: string | null;
};

const alignOptions = ["", "center", "right"] as const;
const backgroundColorOptions = [
  "#FFE5E5",
  "#FFE2C2",
  "#FFF5C2",
  "#B2FFDD",
  "#B2D1FF",
  "#E7C2FF",
  "#DEE1E3",
  "#FFFFFF"
] as const;
const colorOptions = [
  "#FF2727",
  "#FF9A27",
  "#FFDB27",
  "#00E57E",
  "#1B76FF",
  "#A927FF",
  "#1E2224"
] as const;
const DEFAULT_VALUE = {
  size: "16px" as (typeof sizeOptions)[number],
  color: "#1E2224" as (typeof colorOptions)[number],
  backgroundColor: "#FFFFFF" as (typeof backgroundColorOptions)[number]
};
const iconsOptions = {
  background:
    '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12.1226 16.1984V7.79844M12.1226 7.79844H8.99844M12.1226 7.79844H14.9984M4.79844 21.5984H19.1984C20.5239 21.5984 21.5984 20.5239 21.5984 19.1984V4.79844C21.5984 3.47295 20.5239 2.39844 19.1984 2.39844H4.79844C3.47295 2.39844 2.39844 3.47295 2.39844 4.79844V19.1984C2.39844 20.5239 3.47295 21.5984 4.79844 21.5984Z" class="ql-stroke ql-fill ql-color-label" /></svg>',
  color:
    '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M4.25 4.70886C4.25 4.31737 4.5735 4 4.97257 4H15.5274C15.9265 4 16.25 4.31737 16.25 4.70886C16.25 5.10035 15.9265 5.41772 15.5274 5.41772H11.1912V19.2911C11.1912 19.6826 10.8677 20 10.4686 20C10.0695 20 9.74602 19.6826 9.74602 19.2911V5.41772H4.97257C4.5735 5.41772 4.25 5.10035 4.25 4.70886Z" class="ql-stroke fill"/><rect x="14.25" y="14" width="6" height="6" rx="3" class="ql-color-label" fill="#1E2224"/></svg>'
};
const sizeOptions = [
  "12px",
  "14px",
  "16px",
  "18px",
  "20px",
  "22px",
  "24px",
  "30px"
] as const;

const updatePickerItemColors = (selector: string) => {
  document.querySelectorAll(`${selector} .ql-picker-item`).forEach(item => {
    const color = item.getAttribute("data-value");

    if (color) {
      (item as HTMLSpanElement).style.setProperty("--bg-color", color);
    }
  });
};

export {
  alignOptions,
  backgroundColorOptions,
  colorOptions,
  DEFAULT_VALUE,
  iconsOptions,
  sizeOptions,
  updatePickerItemColors
};
export type { attributorsType, quillIconsType };
