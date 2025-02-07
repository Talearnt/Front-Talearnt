import { ComponentProps, ReactNode, RefObject } from "react";

import { classNames } from "@utils/classNames";

type DropdownOptionItemProps = ComponentProps<"button"> & {
  buttonRef?: RefObject<HTMLButtonElement>;
  checked: boolean;
  children?: ReactNode;
  label: string;
  hasHoverStyle?: boolean;
};

function DropdownOptionItem({
  buttonRef,
  checked,
  children,
  label,
  hasHoverStyle,
  ...props
}: DropdownOptionItemProps) {
  return (
    <button
      ref={buttonRef}
      className={classNames(
        "group/button",
        "flex flex-shrink-0 items-center justify-between",
        "h-[50px] rounded-lg px-4",
        hasHoverStyle && "hover:bg-talearnt_BG_Up_01",
        checked && "bg-talearnt_BG_Up_01"
      )}
      {...props}
    >
      {children}
      <span
        className={classNames(
          "text-body2_16_medium text-talearnt_Text_04",
          hasHoverStyle && "group-hover/button:text-talearnt_Text_02",
          checked && "text-talearnt_Text_02"
        )}
      >
        {label}
      </span>
    </button>
  );
}

export { DropdownOptionItem };
