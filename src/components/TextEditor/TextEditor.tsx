import { useEffect, useRef, useState } from "react";

import ReactQuill from "react-quill-new";

import { classNames } from "@utils/classNames";

import { ErrorIcon } from "@components/icons/ErrorIcon/ErrorIcon";
import { Toolbar } from "@components/TextEditor/Toolbar/Toolbar";

import "react-quill-new/dist/quill.snow.css";

type TextEditorProps = {
  value: string;
  onChangeHandler: (data: { value: string; pureText: string }) => void;
  editorKey?: string;
  error?: string;
};

function TextEditor({
  value,
  onChangeHandler,
  editorKey,
  error
}: TextEditorProps) {
  const quillRef = useRef<ReactQuill>(null);

  const [isExpanded, setIsExpanded] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const hasError = !!error;

  const handleChange = (value: string) => {
    if (!quillRef.current) {
      return;
    }

    const editor = quillRef.current.getEditor();

    onChangeHandler({ value, pureText: editor.getText() });
  };

  useEffect(() => {
    const handleExpanded = () => {
      setIsExpanded(Boolean(document.querySelector(".ql-expanded")));
    };

    window.addEventListener("click", handleExpanded);

    return () => window.removeEventListener("click", handleExpanded);
  }, []);

  return (
    <div className={"flex flex-col"}>
      <div
        className={classNames(
          "flex flex-col",
          "overflow-hidden rounded-xl border border-talearnt_Line_01",
          (isFocused || isExpanded) && "border-talearnt_Primary_01",
          hasError && "border-talearnt_Error_01"
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
            onChange={handleChange}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            key={editorKey}
          />
          <span
            className={classNames(
              "ml-auto",
              "text-body2_16_medium text-talearnt_Text_04"
            )}
          >
            {(quillRef.current?.editor?.getLength() ?? 1) - 1}/1000
          </span>
        </div>
      </div>
      {hasError && (
        <div className={"mt-1 flex items-center gap-1"}>
          <ErrorIcon />
          <span className={"text-caption1_14_medium text-talearnt_Error_01"}>
            {error}
          </span>
        </div>
      )}
    </div>
  );
}

export { TextEditor };
