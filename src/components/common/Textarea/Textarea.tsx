import {
  ChangeEvent,
  ComponentProps,
  forwardRef,
  useImperativeHandle,
  useRef,
} from "react";

import { classNames } from "@shared/utils/classNames";

const Textarea = forwardRef<HTMLTextAreaElement, ComponentProps<"textarea">>(
  ({ className, onChange, maxLength, value, ...props }, ref) => {
    const textareaRef = useRef<HTMLTextAreaElement | null>(null);

    // 외부 ref 연결
    useImperativeHandle(ref, () => textareaRef.current as HTMLTextAreaElement);

    // wrapper 클릭했을 때 textarea focus
    const handleWrapperClick = () => textareaRef.current?.focus();
    // textarea 값이 바뀔 때 높이를 변경
    const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
      const textarea = e.target;
      // 높이 자동 조절
      textarea.style.height = "auto";
      textarea.style.height = `${textarea.scrollHeight}px`;
      onChange?.(e);
    };

    return (
      <div
        className={classNames(
          "flex",
          "w-full rounded-lg border border-talearnt_Line_01 bg-talearnt_BG_Background px-[15px] py-[11px]",
          "cursor-text",
          "focus-within:border-talearnt_Primary_01 hover:border-talearnt_Primary_01",
          className
        )}
        onClick={handleWrapperClick}
      >
        <textarea
          ref={textareaRef}
          rows={1}
          className={classNames(
            "flex-1",
            "text-body2_16_medium text-talearnt_Text_02",
            "resize-none placeholder:text-talearnt_Text_04 focus:outline-none"
          )}
          value={value}
          {...props}
          onChange={handleChange}
        />
        {maxLength !== undefined && (
          <span className={"text-body2_16_medium text-talearnt_Text_04"}>
            {String(value).length}/{maxLength}
          </span>
        )}
      </div>
    );
  }
);

export { Textarea };
