import { useRef, useState } from "react";

import { classNames } from "@utils/classNames";

import { useOutsideClick } from "@components/dropdowns/dropdown.hook";

import { useToastStore } from "@common/common.store";

import { Button } from "@components/Button/Button";
import { Chip } from "@components/Chip/Chip";
import { HorizontalScrollWrapper } from "@components/HorizontalScrollWrapper/HorizontalScrollWrapper";
import { CaretIcon } from "@components/icons/caret/CaretIcon/CaretIcon";

import { dropdownOptionType } from "@components/dropdowns/dropdown.type";

type DropdownSearchableProps<T> = {
  label: string;
  options: dropdownOptionType<dropdownOptionType<T>[]>[];
  onSelectHandler: ({
    checked,
    value
  }: {
    checked: boolean;
    value: T[];
  }) => void;
  selectedValue: T[];
  maximumConfig?: {
    count: number;
    errorText: string;
  };
};

function DropdownWithCategories<T = string>({
  label,
  options,
  onSelectHandler,
  selectedValue,
  maximumConfig: { count, errorText } = {
    count: 20,
    errorText: "키워드는 20개까지만 설정 가능해요"
  }
}: DropdownSearchableProps<T>) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const checkboxRef = useRef<HTMLInputElement>(null);

  useOutsideClick(wrapperRef, checkboxRef);

  const setToast = useToastStore(state => state.setToast);

  const [selectedCategoryIndex, setSelectedCategoryIndex] = useState(0);
  const [selectedValueList, setSelectedValueList] =
    useState<T[]>(selectedValue);

  return (
    <div ref={wrapperRef} className={"relative w-fit"}>
      <label
        className={classNames(
          "peer/label group/label",
          "flex items-center gap-2",
          "rounded-full border border-talearnt_Icon_03 py-[7px] pl-[23px] pr-[11px]",
          "cursor-pointer",
          "has-[:checked]:border-talearnt_Primary_01"
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
            "peer-checked/checkbox:text-talearnt_Primary_01"
          )}
        >
          {label}
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
          "flex-col gap-4",
          "z-10 mt-1 rounded-2xl border border-talearnt_Line_01 bg-talearnt_BG_Background p-[23px] shadow-shadow_02",
          "peer-has-[:checked]/label:flex"
        )}
      >
        <HorizontalScrollWrapper>
          {(options as dropdownOptionType<T[]>[]).map(({ label }, index) => (
            <label
              className={classNames(
                "group/label",
                "px-3 py-2 shadow-[inset_0_-1px_0_0] shadow-talearnt_Line_01",
                "cursor-pointer",
                "has-[:checked]:text-talearnt_Text_02 has-[:checked]:shadow-[inset_0_-2px_0_0] has-[:checked]:shadow-talearnt_Primary_01"
              )}
              key={`main-option-${label}`}
            >
              <input
                className={"peer/radio hidden"}
                checked={index === selectedCategoryIndex}
                onChange={({ target }) =>
                  setSelectedCategoryIndex(Number(target.value))
                }
                name={"category"}
                value={index}
                type={"radio"}
              />
              <span
                className={classNames(
                  "text-body2_16_semibold text-talearnt_Text_04",
                  "group-hover/label:text-talearnt_Text_02",
                  "peer-checked/radio:text-talearnt_Text_02"
                )}
              >
                {label}
              </span>
            </label>
          ))}
        </HorizontalScrollWrapper>
        <div
          className={classNames(
            "flex flex-wrap content-start gap-2",
            "h-[136px] pr-2",
            "scrollbar-w10-5 scrollbar overflow-y-scroll"
          )}
        >
          {options[selectedCategoryIndex].value.map(({ label, value }) => {
            const isSelected = selectedValueList.includes(value);
            return (
              <Chip
                onClickHandler={() => {
                  if (isSelected) {
                    setSelectedValueList(prev =>
                      prev.filter(selected => selected !== value)
                    );

                    return;
                  }

                  if (!!count && selectedValueList.length >= count) {
                    setToast({ message: errorText, type: "error" });

                    return;
                  }

                  setSelectedValueList(prev => [...prev, value]);
                }}
                pressed={isSelected}
                key={`categories-dropdown-option-${label}`}
              >
                {label}
              </Chip>
            );
          })}
        </div>
        <div className={"h-px w-full bg-talearnt_Line_01"} />
        <div className={"flex"}>
          {!!count && (
            <span className={"text-body2_16_medium text-talearnt_Text_04"}>
              {selectedValueList.length}/{count}
            </span>
          )}
          <Button
            buttonStyle={"outlined"}
            className={"ml-auto px-[23px]"}
            onClick={() => setSelectedValueList([])}
          >
            초기화
          </Button>
          <Button
            className={"px-[23px]"}
            onClick={() =>
              onSelectHandler({ checked: true, value: selectedValueList })
            }
          >
            등록하기
          </Button>
        </div>
      </div>
    </div>
  );
}

export { DropdownWithCategories };
