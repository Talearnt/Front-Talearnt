import { useEffect, useRef } from "react";
import { useForm } from "react-hook-form";

import { classNames } from "@utils/classNames";

import { CheckBox } from "@components/CheckBox/CheckBox";
import { CaretIcon } from "@components/icons/CaretIcon/CaretIcon";
import { CloseIcon } from "@components/icons/CloseIcon/CloseIcon";
import { AutoResizeInput } from "@components/inputs/AutoResizeInput/AutoResizeInput";

import {
  commonDropdownProps,
  dropdownOptionType
} from "@components/dropdowns/dropdown.type";

import styles from "./SearchableDropdown.module.css";

type SearchableDropdownProps<T> = commonDropdownProps<
  T | dropdownOptionType<T>[]
> & {
  placeholder?: string;
  selectedOptionsArray: dropdownOptionType<T>[];
};

const optionsStyle = classNames(
  "flex flex-col gap-2",
  "m-[7px] mr-[7px] w-full pr-4",
  "overflow-y-auto",
  styles.scrollbar
);

function SearchableDropdown<T = string>({
  options,
  onSelectHandler,
  placeholder,
  selectedOptionsArray
}: SearchableDropdownProps<T>) {
  const scrollRefArray = useRef<(HTMLDivElement | null)[]>([]);

  const { register, setValue, watch } = useForm<{
    checkbox: boolean;
    search: string;
    selectedCategoryIndex?: number;
  }>();

  const [isOpen, search, selectedCategoryIndex] = watch([
    "checkbox",
    "search",
    "selectedCategoryIndex"
  ]);
  const hasSubOption = Array.isArray(options[0].value);

  useEffect(() => {
    // 기본 or 1차 옵션 스크롤 바 스타일, 스크롤 위치 변경
    if (
      !scrollRefArray.current[0] ||
      !scrollRefArray.current[0].parentElement
    ) {
      return;
    }

    const { parentElement, scrollHeight } = scrollRefArray.current[0];
    const isScrollable = scrollHeight > parentElement.offsetHeight;
    const dividerStyle = hasSubOption ? styles.divider2 : styles.divider1;

    parentElement.classList.toggle(dividerStyle, isScrollable);
    scrollRefArray.current[0].scrollTo({ top: 0 });
  }, [isOpen]);

  useEffect(() => {
    // 서브 옵션 스크롤 바 스타일, 스크롤 위치 변경
    if (
      !scrollRefArray.current[1] ||
      !scrollRefArray.current[1].parentElement
    ) {
      return;
    }

    const { parentElement, scrollHeight } = scrollRefArray.current[1];
    const isScrollable = scrollHeight > parentElement.offsetHeight;

    parentElement.classList.toggle(styles.divider1, isScrollable);
    scrollRefArray.current[1].scrollTo({ top: 0 });
  }, [selectedCategoryIndex]);

  return (
    <div className={"relative w-[388px]"}>
      <label
        className={classNames(
          "peer/label group/label",
          "flex items-center",
          "rounded-lg border border-talearnt-Line_01 px-[15px] py-[10px]",
          "cursor-pointer"
        )}
      >
        <input
          {...register("checkbox")}
          className={"hidden"}
          type={"checkbox"}
        />
        <div className={classNames("flex flex-wrap gap-2", "min-h-7 w-full")}>
          {/*선택한 값 버튼칩*/}
          {selectedOptionsArray.map(({ label, value }) => (
            <div
              className={classNames(
                "flex items-center gap-1",
                "rounded-[6px] bg-talearnt-BG_Up_02 px-2 py-[5px]"
              )}
              key={String(value)}
            >
              <span className={"text-sm font-semibold"}>{label}</span>
              <CloseIcon size={16} />
            </div>
          ))}
          <AutoResizeInput
            className={classNames(
              "flex-1",
              "font-medium",
              "focus:outline-none"
            )}
            onClick={({ target }) => {
              setValue("checkbox", !isOpen);

              if (isOpen) {
                (target as HTMLInputElement).blur();
              }
            }}
            onChange={({ target }) => setValue("search", target.value)}
            placeholder={
              selectedOptionsArray.length === 0 ? placeholder : undefined
            }
            autoComplete={"off"}
          />
        </div>
        <CaretIcon
          className={classNames(
            "shrink-0",
            "stroke-talearnt-Icon_03",
            "group-hover/label:stroke-talearnt-Icon_01",
            isOpen && "rotate-180 stroke-talearnt-Icon_01"
          )}
        />
      </label>
      {/*드롭다운 옵션*/}
      <div
        className={classNames(
          "absolute hidden",
          "mt-2 max-h-[298px] w-full rounded-lg",
          "border border-talearnt-Line_01 bg-talearnt-BG_Background shadow-[0_0_20px_0_rgba(0,0,0,0.08)]",
          "peer-has-[:checked]/label:flex"
        )}
      >
        <div
          className={optionsStyle}
          ref={element => (scrollRefArray.current = [element])}
        >
          {options.map(({ label, value }, index) => {
            const checked = hasSubOption
              ? selectedCategoryIndex === index
              : selectedOptionsArray.some(
                  ({ value: selectedValue }) => selectedValue === value
                );

            return (
              <CheckBox
                className={classNames(
                  "group/checkbox",
                  "rounded-[10px] px-4 py-[13px]",
                  "hover:bg-talearnt-BG_Up_01",
                  checked && "bg-talearnt-BG_Up_01"
                )}
                checked={checked}
                onChange={({ target }) =>
                  hasSubOption
                    ? setValue(
                        "selectedCategoryIndex",
                        index === selectedCategoryIndex ? undefined : index
                      )
                    : onSelectHandler({ checked: target.checked, label, value })
                }
                key={String(value)}
              >
                <span
                  className={classNames(
                    "text-base font-medium text-talearnt-Text_04",
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
        {/*서브 옵션*/}
        {hasSubOption && (
          <div
            className={optionsStyle}
            ref={element => (scrollRefArray.current[1] = element)}
          >
            {selectedCategoryIndex !== undefined &&
              (
                options[selectedCategoryIndex].value as dropdownOptionType<T>[]
              ).map(({ label, value }) => {
                const checked = selectedOptionsArray.some(
                  ({ value: selectedValue }) => selectedValue === value
                );

                return (
                  <CheckBox
                    className={classNames(
                      "group/checkbox",
                      "rounded-[10px] px-4 py-[13px]",
                      "hover:bg-talearnt-BG_Up_01",
                      checked && "bg-talearnt-BG_Up_01"
                    )}
                    checked={checked}
                    onChange={({ target }) =>
                      onSelectHandler({
                        checked: target.checked,
                        label,
                        value
                      })
                    }
                    key={String(value)}
                  >
                    <span
                      className={classNames(
                        "text-base font-medium text-talearnt-Text_04",
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
        )}
      </div>
    </div>
  );
}

export { SearchableDropdown };
