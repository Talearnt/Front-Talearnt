import { useEffect, useMemo, useRef, useState } from "react";

import ReactQuill from "react-quill-new";

import { compressImageFile } from "@pages/articles/WriteArticle/core/writeArticle.util";
import { classNames } from "@utils/classNames";

import { useToastStore } from "@common/common.store";

import { Toolbar } from "@pages/articles/WriteArticle/components/TextEditor/Toolbar/Toolbar";

import { ErrorIcon } from "@components/icons/ErrorIcon/ErrorIcon";

import { imageFileType } from "@pages/articles/WriteArticle/core/writeArticle.type";

type TextEditorProps = {
  value: string;
  onChangeHandler: (data: { value: string; pureText: string }) => void;
  onImageHandler: (imageFileList: imageFileType[]) => void;
  error?: string;
};

function TextEditor({
  value,
  onChangeHandler,
  onImageHandler,
  error
}: TextEditorProps) {
  const quillRef = useRef<ReactQuill>(null);

  const setToast = useToastStore(state => state.setToast);

  const [isExpanded, setIsExpanded] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [imageFileList, setImageFileList] = useState<imageFileType[]>([]);

  const hasError = !!error;

  const handleImageUpload = () => {
    if (!quillRef.current) {
      return;
    }

    const editor = quillRef.current.getEditor();
    const currentValue = editor.getSemanticHTML();
    const parser = new DOMParser();
    const doc = parser.parseFromString(currentValue, "text/html");
    const imageCount = Array.from(doc.querySelectorAll("img")).length;

    if (imageCount >= 5) {
      setToast({
        message: "이미지 개수는 최대 5개까지 허용됩니다.",
        type: "error"
      });

      return;
    }

    const input = document.createElement("input");
    input.setAttribute("type", "file");
    input.setAttribute(
      "accept",
      "image/jpeg, image/png, image/jfif, image/tiff, image/gif, image/webp"
    );
    input.setAttribute("multiple", "true");
    input.click();

    input.onchange = async () => {
      if (!input.files) {
        return;
      }

      const files = Array.from(input.files);

      if (imageCount + files.length > 5) {
        setToast({
          message: "이미지 개수는 최대 5개까지 허용됩니다.",
          type: "error"
        });
        return;
      }

      for (const file of files) {
        try {
          const imageFile = await compressImageFile(file);
          const range = editor.getSelection();

          setImageFileList(prev => [...prev, imageFile]);

          if (range) {
            editor.insertEmbed(range.index, "image", imageFile.url);
          }
        } catch (message) {
          setToast({
            message: message as string,
            type: "error"
          });
        }
      }
    };
  };

  const modules = useMemo(
    () => ({
      toolbar: {
        container: "#toolbar",
        handlers: {
          image: handleImageUpload
        }
      },
      maxlength: { maxLength: 1000 }
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  useEffect(() => {
    const handleExpanded = () => {
      setIsExpanded(Boolean(document.querySelector(".ql-expanded")));
    };

    window.addEventListener("click", handleExpanded);

    return () => window.removeEventListener("click", handleExpanded);
  }, []);
  useEffect(() => {
    onImageHandler(imageFileList);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [imageFileList]);

  return (
    <div className="flex flex-col">
      <div
        className={classNames(
          "flex flex-col",
          "rounded-xl border border-talearnt_Line_01",
          (isFocused || isExpanded) && "border-talearnt_Primary_01",
          hasError && "border-talearnt_Error_01"
        )}
      >
        <Toolbar />
        <div className={classNames("flex flex-col", "p-6 pb-[23px]")}>
          <ReactQuill
            ref={quillRef}
            modules={modules}
            value={value}
            onChange={(value, _1, _2, editor) =>
              onChangeHandler({ value, pureText: editor.getText() })
            }
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder={
              "내용을 20글자 이상 입력해 주세요\n\n“저는 어릴 때 일본에서 지내서 일본어를 잘 가르쳐 드릴 수 있어요!”"
            }
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
