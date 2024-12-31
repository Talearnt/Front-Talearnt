import { Dispatch, SetStateAction } from "react";

import { classNames } from "@utils/classNames";

import { CheckBox } from "@components/CheckBox/CheckBox";
import { CaretIcon } from "@components/icons/CaretIcon/CaretIcon";

type MultiSelectDropdownProps<T> = {
  title: string;
  options: { label: string; value: T }[];
  onSelectHandler: Dispatch<SetStateAction<T[]>>;
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
          "hover:bg-talearnt-BG_Up_01 has-[:checked]:bg-talearnt-BG_Up_01"
        )}
      >
        <input className={"peer/checkbox hidden"} type={"checkbox"} />
        <span
          className={classNames(
            "text-lg text-talearnt-Text_04",
            "group-hover/label:font-medium group-hover/label:text-talearnt-Text_02",
            "peer-checked/checkbox:font-semibold peer-checked/checkbox:text-talearnt-Text_01"
          )}
        >
          {title}
        </span>
        <CaretIcon
          className={classNames(
            "stroke-talearnt-Icon_03",
            "group-hover/label:stroke-talearnt-Icon_01",
            "peer-checked/checkbox:rotate-180 peer-checked/checkbox:stroke-talearnt-Icon_01"
          )}
        />
      </label>
      <div
        className={classNames(
          "hidden flex-col gap-2 peer-has-[:checked]/label:flex",
          "px-2 py-1"
        )}
      >
        {options.map(({ label, value }) => {
          const checked = selectedValueArray.includes(value);

          return (
            <CheckBox
              className={classNames(
                "group/checkbox",
                "rounded-lg px-4 py-[13px]",
                "hover:bg-talearnt-BG_Up_01",
                checked && "bg-talearnt-BG_Up_01"
              )}
              checked={checked}
              onChange={({ target }) => {
                if (target.checked) {
                  onSelectHandler(prev => [...prev, value]);
                } else {
                  onSelectHandler(prev => prev.filter(item => item !== value));
                }
              }}
              key={`${label}-${String(value)}`}
            >
              <span
                className={classNames(
                  "text-lg text-talearnt-Text_04",
                  "group-hover/checkbox:font-medium group-hover/checkbox:text-talearnt-Text_02",
                  checked && "!font-semibold !text-talearnt-Text_01"
                )}
              >
                {label}
              </span>
            </CheckBox>
          );
        })}
      </div>
    </div>
  );
}

export { MultiSelectDropdown };
