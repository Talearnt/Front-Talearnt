import { useEffect, useRef, useState } from "react";

import { classNames } from "@shared/utils/classNames";

import { useOutsideClick } from "@components/common/dropdowns/dropdown.hook";

import { useToastStore } from "@store/toast.store";

import { Button } from "@components/common/Button/Button";
import { Chip } from "@components/common/Chip/Chip";
import { HorizontalScrollWrapper } from "@components/common/HorizontalScrollWrapper/HorizontalScrollWrapper";
import { CaretIcon } from "@components/common/icons/caret/CaretIcon";

import { dropdownOptionType } from "@components/common/dropdowns/dropdown.type";

type DropdownSearchableProps<T> = {
  label: string;
  options: dropdownOptionType<dropdownOptionType<T>[]>[];
  onSelectHandler: (value: T[]) => void;
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
    errorText: "키워드는 20개까지만 설정 가능해요",
  },
}: DropdownSearchableProps<T>) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const checkboxRef = useRef<HTMLInputElement>(null);

  useOutsideClick(wrapperRef, checkboxRef);

  const setToast = useToastStore(state => state.setToast);

  const [selectedCategoryIndex, setSelectedCategoryIndex] = useState(0);
  const [selectedValueList, setSelectedValueList] = useState<
    dropdownOptionType<T>[]
  >([]);

  useEffect(() => {
    if (selectedValue.length === 0) {
      setSelectedValueList([]);
      return;
    }

    const result = [];
    const selectedValueSet = new Set(selectedValue);

    for (const { value } of options) {
      for (const option of value) {
        if (selectedValueSet.has(option.value)) {
          result.push(option);
        }
      }
    }

    setSelectedValueList(result);
  }, [options, selectedValue]);

  return (
    <div ref={wrapperRef} className={classNames("relative", "w-fit")}>
      <label
        className={classNames(
          "peer/label group/label",
          "flex items-center gap-2",
          "rounded-full border border-talearnt_Icon_03 py-[7px] pl-[23px] pr-[11px]",
          "cursor-pointer",
          "has-[:checked]:border-talearnt_Primary_01",
          selectedValueList.length > 0 && "border-talearnt_Primary_01"
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
            selectedValueList.length > 0 && "text-talearnt_Primary_01"
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
          {options.map(({ label: category }, index) => (
            <label
              className={classNames(
                "group/label",
                "px-3 py-2 shadow-[inset_0_-1px_0_0] shadow-talearnt_Line_01",
                "cursor-pointer",
                "has-[:checked]:text-talearnt_Text_02 has-[:checked]:shadow-[inset_0_-2px_0_0] has-[:checked]:shadow-talearnt_Primary_01"
              )}
              key={`${label}-main-option-${category}`}
            >
              <input
                className={"peer/radio hidden"}
                checked={index === selectedCategoryIndex}
                onChange={({ target }) =>
                  setSelectedCategoryIndex(Number(target.value))
                }
                name={`${label}-category-${category}`}
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
                {category}
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
          {options[selectedCategoryIndex].value.map(
            ({ label: option, value }) => {
              const isSelected = selectedValueList.some(
                ({ value: selectedValue }) => value === selectedValue
              );

              return (
                <Chip
                  onClickHandler={() => {
                    if (isSelected) {
                      setSelectedValueList(prev =>
                        prev.filter(
                          ({ value: selectedValue }) => value !== selectedValue
                        )
                      );

                      return;
                    }

                    if (!!count && selectedValueList.length >= count) {
                      setToast({ message: errorText, type: "error" });

                      return;
                    }

                    setSelectedValueList(prev => [
                      ...prev,
                      { label: option, value },
                    ]);
                  }}
                  pressed={isSelected}
                  key={`${label}-categories-option-${option}`}
                >
                  {option}
                </Chip>
              );
            }
          )}
        </div>
        <div className={"h-px w-full bg-talearnt_Line_01"} />
        {selectedValueList.length > 0 && (
          <div className={classNames("flex flex-wrap gap-2")}>
            {selectedValueList.map(({ label: option, value }) => (
              <Chip
                onCloseHandler={() =>
                  setSelectedValueList(prev =>
                    prev.filter(
                      ({ value: selectedValue }) => value !== selectedValue
                    )
                  )
                }
                type={"keyword"}
                key={`${label}-selected-option-${option}`}
              >
                {option}
              </Chip>
            ))}
          </div>
        )}
        <div className={"flex"}>
          {!!count && (
            <span
              className={"mt-auto text-body2_16_medium text-talearnt_Text_04"}
            >
              {selectedValueList.length}/{count}
            </span>
          )}
          <Button
            className={"ml-auto px-[23px]"}
            onClick={() => setSelectedValueList([])}
            buttonStyle={"outlined"}
            size={"small"}
          >
            초기화
          </Button>
          <Button
            className={"ml-4 px-[23px]"}
            onClick={() => {
              if (!checkboxRef.current) {
                return;
              }

              onSelectHandler(selectedValueList.map(({ value }) => value));
              checkboxRef.current.checked = false;
            }}
            size={"small"}
          >
            등록하기
          </Button>
        </div>
      </div>
    </div>
  );
}

export { DropdownWithCategories };
