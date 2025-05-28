import { ChangeEvent } from "react";

import { classNames } from "@shared/utils/classNames";

import { Checkbox } from "@components/common/Checkbox/Checkbox";

type DropdownOptionCheckboxProps = {
  checked: boolean;
  onChangeHandler: (e: ChangeEvent<HTMLInputElement>) => void;
  label: string;
};

function DropdownOptionCheckbox({
  checked,
  onChangeHandler,
  label
}: DropdownOptionCheckboxProps) {
  return (
    <Checkbox
      className={classNames(
        "group/checkbox",
        "flex-shrink-0",
        "min-h-[50px] rounded-lg px-4 py-[11px]",
        "hover:bg-talearnt_BG_Up_01",
        checked && "bg-talearnt_BG_Up_01"
      )}
      checked={checked}
      onChange={onChangeHandler}
    >
      <span
        className={classNames(
          "text-body2_16_medium text-talearnt_Text_04",
          "group-hover/checkbox:text-talearnt_Text_02",
          checked && "text-body2_16_semibold text-talearnt_Text_01"
        )}
      >
        {label}
      </span>
    </Checkbox>
  );
}

export { DropdownOptionCheckbox };
