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
        "rounded-lg px-4 py-[13px]",
        "hover:bg-talearnt-BG_Up_01",
        checked && "bg-talearnt-BG_Up_01"
      )}
      checked={checked}
      onChange={onChangeHandler}
    >
      <span
        className={classNames(
          "text-lg font-medium text-talearnt-Text_04",
          "group-hover/checkbox:text-talearnt-Text_02",
          checked && "!font-semibold !text-talearnt-Text_01",
          className
        )}
      >
        {label}
      </span>
    </CheckBox>
  );
}

export { DropdownOptionItem };
