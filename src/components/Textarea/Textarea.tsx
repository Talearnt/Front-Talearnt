import { ChangeEvent, ComponentProps, forwardRef } from "react";

import { classNames } from "@utils/classNames";

const Textarea = forwardRef<HTMLTextAreaElement, ComponentProps<"textarea">>(
  ({ className, onChange, maxLength, value, ...props }, ref) => {
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
          "focus-within:border-talearnt_Primary_01 hover:border-talearnt_Primary_01",
          className
        )}
      >
        <textarea
          ref={ref}
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
