import { useEffect } from "react";

import QuillManager from "@shared/utils/QuillManager";

import { AlignIcon } from "@components/common/icons/textEditor/AlignIcon";
import { BoldIcon } from "@components/common/icons/textEditor/BoldIcon";
import { ImageIcon } from "@components/common/icons/textEditor/ImageIcon";
import { ItalicIcon } from "@components/common/icons/textEditor/ItalicIcon";
import { LinkIcon } from "@components/common/icons/textEditor/LinkIcon";
import { UnderlineIcon } from "@components/common/icons/textEditor/UnderlineIcon";

import {
  alignOptions,
  backgroundColorOptions,
  colorOptions,
  DEFAULT_VALUE,
  sizeOptions,
} from "@components/articles/writeArticle/TextEditor/Toolbar/toolbar.constants";

import "./Toolbar.css";

function Divider() {
  return <div className={"h-6 w-[1px] bg-talearnt_Line_01"} />;
}

function Toolbar() {
  useEffect(() => {
    const setupDOMElements = () => {
      const quillManager = QuillManager.getInstance();
      if (quillManager.isQuillReady()) {
        quillManager.setupDOMElements();
      } else {
        // 초기화가 완료될 때까지 재시도
        setTimeout(setupDOMElements, 100);
      }
    };

    setupDOMElements();
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
