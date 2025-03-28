import { ChangeEvent, ComponentProps, useRef, useState } from "react";

import { classNames } from "@utils/classNames";

function Textarea({
  className,
  onChange,
  maxLength,
  ...props
}: ComponentProps<"textarea">) {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const [value, setValue] = useState("");

  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const textarea = e.target;

    setValue(textarea.value);
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
        "focus-within:border-talearnt_Primary_01 hover:border-talearnt_Primary_01",
        className
      )}
    >
      <textarea
        ref={textareaRef}
        rows={1}
        className={classNames(
          "flex-1",
          "text-body2_16_medium text-talearnt_Text_02",
          "resize-none placeholder:text-talearnt_Text_04 focus:outline-none"
        )}
        {...props}
        onChange={handleChange}
      />
      {maxLength !== undefined && (
        <span className={"text-body2_16_medium text-talearnt_Text_04"}>
          {value.length}/{maxLength}
        </span>
      )}
    </div>
  );
}

export { Textarea };
