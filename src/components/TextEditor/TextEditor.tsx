import { useEffect, useRef, useState } from "react";
import ReactQuill from "react-quill-new";

import { classNames } from "@utils/classNames";

import { Toolbar } from "@components/TextEditor/Toolbar";

import "react-quill-new/dist/quill.snow.css";

function TextEditor() {
  const quillRef = useRef<ReactQuill>(null);

  const [isExpanded, setIsExpanded] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [value, setValue] = useState("");

  useEffect(() => {
    const handleExpanded = () => {
      setIsExpanded(Boolean(document.querySelector(".ql-expanded")));
    };

    window.addEventListener("click", handleExpanded);

    return () => window.removeEventListener("click", handleExpanded);
  }, []);

  return (
    <div
      className={classNames(
        "flex flex-col",
        "border-talearnt-Line_01 overflow-hidden rounded-xl border",
        (isFocused || isExpanded) && "border-talearnt-Primary_01"
      )}
    >
      <Toolbar />
      <div className={classNames("flex flex-col", "p-6 pb-[23px]")}>
        <ReactQuill
          ref={quillRef}
          modules={{
            toolbar: {
              container: "#toolbar"
            }
          }}
          value={value}
          onChange={setValue}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />
        <span
          className={classNames(
            "ml-auto",
            "text-talearnt-Text_04 text-body2_16_medium"
          )}
        >
          {(quillRef.current?.editor?.getLength() ?? 1) - 1}/1000
        </span>
      </div>
    </div>
  );
}

export { TextEditor };
