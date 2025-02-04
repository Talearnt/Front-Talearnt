import { classNames } from "@utils/classNames";

import { DropdownOptionItem } from "@components/dropdowns/DropdownOptionItem/DropdownOptionItem";
import { CaretIcon } from "@components/icons/CaretIcon/CaretIcon";

import { commonDropdownProps } from "@components/dropdowns/dropdown.type";

type MultiSelectDropdownProps<T> = commonDropdownProps<T> & {
  title: string;
  selectedValueArray: T[];
};

function MultiSelectDropdown<T = string>({
  title,
  options,
  onSelectHandler,
  selectedValueArray
}: MultiSelectDropdownProps<T>) {
  return (
    <div className={classNames("flex flex-col")}>
      <label
        className={classNames(
          "peer/label group/label",
          "flex items-center justify-between",
          "m-2 h-[70px] rounded-lg pl-4 pr-2",
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
            "stroke-talearnt_Icon_03",
            "group-hover/label:stroke-talearnt_Icon_01",
            "peer-checked/checkbox:rotate-180 peer-checked/checkbox:stroke-talearnt_Icon_01"
          )}
        />
      </label>
      <div
        className={classNames(
          "hidden flex-col gap-2",
          "px-2 py-1",
          "peer-has-[:checked]/label:flex"
        )}
      >
        {options.map(({ label, value }) => (
          <DropdownOptionItem
            checked={selectedValueArray.includes(value)}
            onChangeHandler={({ target }) =>
              onSelectHandler({ checked: target.checked, label, value })
            }
            label={label}
          />
        ))}
      </div>
    </div>
  );
}

export { MultiSelectDropdown };
