import { useMemo, useRef } from "react";

import { classNames } from "@utils/classNames";

import { useOutsideClick } from "@components/dropdowns/dropdown.hook";

import { DropdownOptionCheckbox } from "@components/dropdowns/DropdownOptionCheckbox/DropdownOptionCheckbox";
import { DropdownOptionItem } from "@components/dropdowns/DropdownOptionItem/DropdownOptionItem";
import { CaretIcon } from "@components/icons/caret/CaretIcon/CaretIcon";

import { dropdownOptionType } from "@components/dropdowns/dropdown.type";

type DropdownSearchableProps<T> = {
  label?: string;
  options: dropdownOptionType<T>[];
  onSelectHandler: ({ checked, value }: { checked: boolean; value: T }) => void;
  selectedValue: T[] | T | undefined;
};

function DropdownLabeled<T = string>({
  label,
  options,
  onSelectHandler,
  selectedValue
}: DropdownSearchableProps<T>) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const checkboxRef = useRef<HTMLInputElement>(null);

  useOutsideClick(wrapperRef, checkboxRef);

  const selectedOption = useMemo(
    () =>
      options.find(({ value }) =>
        Array.isArray(selectedValue)
          ? selectedValue.includes(value)
          : selectedValue === value
      ),
    [options, selectedValue]
  );

  return (
    <div ref={wrapperRef} className={"relative w-fit"}>
      <label
        className={classNames(
          "peer/label group/label",
          "flex items-center gap-2",
          "rounded-full border border-talearnt_Icon_03 py-[7px] pl-[23px] pr-[11px]",
          "cursor-pointer",
          "has-[:checked]:border-talearnt_Primary_01",
          selectedOption && label && "border-talearnt_Primary_01"
        )}
      >
        <input
          ref={checkboxRef}
          className={"peer/checkbox hidden"}
          type={"checkbox"}
        />
        <span
          className={classNames(
            "text-body2_16_medium text-talearnt_Text_02",
            "group-hover/label:text-talearnt_Primary_01",
            "peer-checked/checkbox:text-talearnt_Primary_01",
            selectedOption && label && "text-talearnt_Primary_01"
          )}
        >
          {selectedOption?.label ?? label}
        </span>
        <CaretIcon
          className={
            "peer-checked/checkbox:-rotate-90 peer-checked/checkbox:stroke-talearnt_Icon_01"
          }
          direction={"bottom"}
        />
      </label>
      {/*드롭다운 옵션*/}
      <div
        className={classNames(
          "absolute hidden",
          "flex-col gap-2",
          "z-[11] mt-1 w-full rounded-xl border border-talearnt_Line_01 bg-talearnt_BG_Background p-[7px] shadow-shadow_02",
          "peer-has-[:checked]/label:flex"
        )}
      >
        {options.map(({ label, value }) =>
          Array.isArray(selectedValue) ? (
            <DropdownOptionCheckbox
              checked={selectedValue.some(
                selectedValue => selectedValue === value
              )}
              onChangeHandler={({ target }) =>
                onSelectHandler({
                  checked: target.checked,
                  value
                })
              }
              label={label}
              key={`labeled-dropdown-option-${label}`}
            />
          ) : (
            <DropdownOptionItem
              className={"whitespace-nowrap"}
              checked={selectedValue === value}
              onClick={() => {
                if (!checkboxRef.current) {
                  return;
                }

                onSelectHandler({
                  checked: true,
                  value
                });
                checkboxRef.current.checked = false;
              }}
              label={label}
              key={`labeled-dropdown-option-${label}`}
            />
          )
        )}
      </div>
    </div>
  );
}

export { DropdownLabeled };
