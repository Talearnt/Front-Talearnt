import { classNames } from "@shared/utils/classNames";

import { DropdownOptionCheckbox } from "@components/common/dropdowns/DropdownOptionCheckbox/DropdownOptionCheckbox";
import { CaretIcon } from "@components/common/icons/caret/CaretIcon/CaretIcon";

import { dropdownOptionType } from "@components/common/dropdowns/dropdown.type";

type DropdownFixedLabelProps<T> = {
  options: dropdownOptionType<T>[];
  onSelectHandler: ({ checked, value }: { checked: boolean; value: T }) => void;
  title: string;
  selectedValueArray: T[];
};

function DropdownFixedLabel<T = string>({
  title,
  options,
  onSelectHandler,
  selectedValueArray,
}: DropdownFixedLabelProps<T>) {
  return (
    <div className={"flex flex-col"}>
      <label
        className={classNames(
          "peer/label group/label",
          "flex items-center justify-between",
          "mx-2 my-1 h-[70px] rounded-lg px-4",
          "cursor-pointer",
          "hover:bg-talearnt_BG_Up_01 has-[:checked]:bg-talearnt_BG_Up_01"
        )}
      >
        <input className={"peer/checkbox hidden"} type={"checkbox"} />
        <span
          className={classNames(
            "text-body1_18_medium text-talearnt_Text_04",
            "group-hover/label:text-talearnt_Text_02",
            "peer-checked/checkbox:text-body1_18_semibold peer-checked/checkbox:text-talearnt_Text_01"
          )}
        >
          {title}
        </span>
        <CaretIcon
          className={classNames(
            "group-hover/label:stroke-talearnt_Icon_01",
            "peer-checked/checkbox:-rotate-90 peer-checked/checkbox:stroke-talearnt_Icon_01"
          )}
          direction={"bottom"}
        />
      </label>
      <div
        className={classNames(
          "hidden flex-col gap-2",
          "mt-2 px-2 py-1",
          "peer-has-[:checked]/label:flex"
        )}
      >
        {options.map(({ label, value }) => (
          <DropdownOptionCheckbox
            checked={selectedValueArray.includes(value)}
            onChangeHandler={({ target }) =>
              onSelectHandler({ checked: target.checked, value })
            }
            label={label}
          />
        ))}
      </div>
    </div>
  );
}

export { DropdownFixedLabel };
