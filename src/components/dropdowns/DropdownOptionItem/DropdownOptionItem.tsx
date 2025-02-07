import { ComponentProps, ReactNode, RefObject } from "react";

import { classNames } from "@utils/classNames";

type DropdownOptionItemProps = ComponentProps<"button"> & {
  buttonRef?: RefObject<HTMLButtonElement>;
  checked: boolean;
  children?: ReactNode;
  label: string;
};

function DropdownOptionItem({
  buttonRef,
  checked,
  children,
  label,
  ...props
}: DropdownOptionItemProps) {
  return (
    <button
      ref={buttonRef}
      className={classNames(
        "group/button",
        "flex flex-shrink-0 items-center justify-between",
        "h-[50px] rounded-lg px-4",
        checked && "bg-talearnt_BG_Up_01"
      )}
      {...props}
    >
      {children}
      <span
        className={classNames(
          "text-body2_16_medium text-talearnt_Text_04",
          checked && "text-talearnt_Text_02"
        )}
      >
        {label}
      </span>
    </button>
  );
}

export { DropdownOptionItem };
