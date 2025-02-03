import { ChangeEvent } from "react";

import { classNames } from "@utils/classNames";

import { CheckBox } from "@components/CheckBox/CheckBox";

type DropdownOptionItemProps = {
  className?: string;
  checked: boolean;
  onChangeHandler: (e: ChangeEvent<HTMLInputElement>) => void;
  label: string;
};

function DropdownOptionItem({
  className,
  checked,
  onChangeHandler,
  label
}: DropdownOptionItemProps) {
  return (
    <CheckBox
      className={classNames(
        "group/checkbox",
        "h-[50px] rounded-lg px-4",
        "hover:bg-talearnt-BG_Up_01",
        checked && "bg-talearnt-BG_Up_01"
      )}
      checked={checked}
      onChange={onChangeHandler}
    >
      <span
        className={classNames(
          "text-talearnt-Text_04 text-body1_18_medium",
          "group-hover/checkbox:text-talearnt-Text_02",
          checked && "!text-talearnt-Text_01 !text-body1_18_semibold",
          className
        )}
      >
        {label}
      </span>
    </CheckBox>
  );
}

export { DropdownOptionItem };
