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
        "hover:bg-talearnt_BG_Up_01",
        checked && "bg-talearnt_BG_Up_01"
      )}
      checked={checked}
      onChange={onChangeHandler}
    >
      <span
        className={classNames(
          "text-body1_18_medium text-talearnt_Text_04",
          "group-hover/checkbox:text-talearnt_Text_02",
          checked && "!text-body1_18_semibold !text-talearnt_Text_01",
          className
        )}
      >
        {label}
      </span>
    </CheckBox>
  );
}

export { DropdownOptionItem };
