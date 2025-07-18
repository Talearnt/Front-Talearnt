import { useEffect } from "react";

import { Quill } from "react-quill-new";

import { AlignIcon } from "@components/common/icons/textEditor/AlignIcon";
import { BoldIcon } from "@components/common/icons/textEditor/BoldIcon";
import { ImageIcon } from "@components/common/icons/textEditor/ImageIcon";
import { ItalicIcon } from "@components/common/icons/textEditor/ItalicIcon";
import { LinkIcon } from "@components/common/icons/textEditor/LinkIcon";
import { UnderlineIcon } from "@components/common/icons/textEditor/UnderlineIcon";

import {
  alignOptions,
  attributorsType,
  backgroundColorOptions,
  colorOptions,
  DEFAULT_VALUE,
  iconsOptions,
  quillIconsType,
  sizeOptions,
  updatePickerItemColors,
} from "@components/articles/writeArticle/TextEditor/Toolbar/toolbar.constants";

import "./Toolbar.css";

const icons = Quill.import("ui/icons") as quillIconsType;
const size = Quill.import("attributors/style/size") as attributorsType;
const color = Quill.import("attributors/style/color") as attributorsType;
const background = Quill.import(
  "attributors/style/background"
) as attributorsType;
const image = Quill.import("formats/image") as {
  sanitize: (url: string) => string;
};

image.sanitize = (url: string) =>
  url.startsWith("blob:") ||
  url.startsWith("http://") ||
  url.startsWith("https://")
    ? url
    : "";

icons.bold = null;
icons.italic = null;
icons.underline = null;
icons.align = null;
icons.color = iconsOptions.color;
icons.background = iconsOptions.background;
icons.link = null;
icons.image = null;
size.whitelist = sizeOptions;
color.whitelist = colorOptions;
background.whitelist = backgroundColorOptions;

Quill.register(background as unknown as string, true);
Quill.register(color as unknown as string, true);
Quill.register(size as unknown as string, true);
Quill.register(
  "modules/maxlength",
  function (
    quill: {
      on: (arg0: string, arg1: () => void) => void;
      getText: () => { length: number };
      deleteText: (arg0: number, arg1: number) => void;
    },
    options: { maxLength: number }
  ) {
    quill.on("text-change", () => {
      const { length } = quill.getText();
      const { maxLength } = options;

      if (length > maxLength) {
        console.log(length, maxLength);
        quill.deleteText(maxLength, length - maxLength);
      }
    });
  }
);

function Divider() {
  return <div className={"h-6 w-[1px] bg-talearnt_Line_01"} />;
}

function Toolbar() {
  useEffect(() => {
    // icons에 size가 없는 이유로 DOM에 접근하여 변경
    const sizeIcon = document.querySelector(".ql-size .ql-picker-label svg");

    if (sizeIcon) {
      sizeIcon.outerHTML =
        '<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M15 7.5L10 12.5L5 7.5" class="ql-stroke" /></svg>';
    }

    // 컬러 피커 아이템의 배경색 변수 저장
    updatePickerItemColors(".ql-color");
    updatePickerItemColors(".ql-background");
  }, []);

  return (
    <div id="toolbar">
      <span className="ql-formats">
        <select
          id={"ql-size"}
          className="ql-size"
          defaultValue={DEFAULT_VALUE.size}
        >
          {sizeOptions.map(size => (
            <option value={size} key={size}>
              {size}
            </option>
          ))}
        </select>
      </span>
      <Divider />
      <span className="ql-formats">
        <button className="ql-bold">
          <BoldIcon />
        </button>
        <button className="ql-italic">
          <ItalicIcon />
        </button>
        <button className="ql-underline">
          <UnderlineIcon />
        </button>
      </span>
      <Divider />
      <span className="ql-formats">
        {alignOptions.map(align => (
          <button className="ql-align" value={align} key={align}>
            <AlignIcon align={align} />
          </button>
        ))}
      </span>
      <Divider />
      <span className="ql-formats">
        <select className="ql-color" defaultValue={DEFAULT_VALUE.color}>
          {colorOptions.map(color => (
            <option value={color} key={color} />
          ))}
        </select>
        <select
          className="ql-background"
          defaultValue={DEFAULT_VALUE.backgroundColor}
        >
          {backgroundColorOptions.map(backgroundColor => (
            <option value={backgroundColor} key={backgroundColor} />
          ))}
        </select>
      </span>
      <Divider />
      <span className="ql-formats">
        <button className="ql-link">
          <LinkIcon />
        </button>
        <button className="ql-image">
          <ImageIcon />
        </button>
      </span>
    </div>
  );
}

export { Toolbar };
