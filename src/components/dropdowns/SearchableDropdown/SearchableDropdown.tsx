import React, {
  ChangeEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState
} from "react";
import { useForm } from "react-hook-form";

import { classNames } from "@utils/classNames";

import useDebounce from "@hook/useDebounce";

import { DropdownOptionItem } from "@components/dropdowns/DropdownOptionItem/DropdownOptionItem";
import { CaretIcon } from "@components/icons/CaretIcon/CaretIcon";
import { CloseIcon } from "@components/icons/CloseIcon/CloseIcon";
import { MakoExpressionSad } from "@components/icons/mako/MakoExpressionSad";
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
  "m-[7px] w-full pr-4",
  "overflow-y-auto",
  styles.scrollbar
);
const optionItemStyle = classNames(
  "flex-shrink-0",
  "h-[50px] rounded-lg px-4",
  "text-left text-body2_16_medium text-talearnt_Text_04"
);

function SearchableDropdown<T = string>({
  options,
  onSelectHandler,
  placeholder,
  selectedOptionsArray
}: SearchableDropdownProps<T>) {
  // 현재 눌린 키보드의 방향
  const arrowDirectionRef = useRef<"ArrowUp" | "ArrowDown">("ArrowUp");
  // 키보드, 마우스 어떤 source 선택하는지 저장
  const inputSourceRef = useRef<"keyboard" | "mouse">("keyboard");
  // 현재 선택된 재능
  const selectedTalentRef = useRef<HTMLButtonElement>(null);
  const scrollRefArray = useRef<(HTMLDivElement | null)[]>([]);

  const { register, setValue, watch } = useForm<{
    checkbox: boolean;
    search: string;
    selectedCategoryIndex?: number;
  }>();

  // 현재 선택된 재능의 index
  const [selectedOptionIndex, setSelectedOptionIndex] = useState(0);

  const [isOpen, selectedCategoryIndex] = watch([
    "checkbox",
    "selectedCategoryIndex"
  ]);
  const hasSubOption = Array.isArray(options[0].value);
  const search = useDebounce(watch("search"));
  // 옵션이 선택되었는지 확인
  const isOptionSelected = useCallback(
    (value: T) =>
      selectedOptionsArray.some(
        ({ value: selectedValue }) => selectedValue === value
      ),
    [selectedOptionsArray]
  );
  // 검색한 재능 키워드 목록
  const searchedOptionsList = useMemo(() => {
    if (!search) {
      return [];
    }

    // 검색한 값으로 공백 제거, 대소문자 구분 X 정규식 생성
    const searchRegex = new RegExp(search.replace(/\s+/g, ""), "i");
    const searchOption = hasSubOption
      ? options.flatMap(({ value }) => value as dropdownOptionType<T>[])
      : options;

    return searchOption.filter(
      ({ label, value }) =>
        searchRegex.test(label.replace(/\s+/g, "")) &&
        !isOptionSelected(value as T)
    ) as dropdownOptionType<T>[];
  }, [hasSubOption, isOptionSelected, options, search]);

  const handleOnChange = useCallback(
    ({ label, value }: { label: string; value: T }) =>
      ({ target }: ChangeEvent<HTMLInputElement>) =>
        onSelectHandler({
          checked: target.checked,
          label,
          value
        }),
    [onSelectHandler]
  );

  // 키보드로 재능을 선택
  const handleKeyDown = ({
    key,
    nativeEvent
  }: React.KeyboardEvent<HTMLInputElement>) => {
    if (nativeEvent.isComposing || !search) {
      // 아직 글자가 조합중인 상태라면 return (한글 이슈)
      return;
    }

    if (key === "Enter") {
      handleOnChange(searchedOptionsList[selectedOptionIndex]);
      setValue("search", "");

      return;
    }

    if (key !== "ArrowUp" && key !== "ArrowDown") {
      return;
    }
    inputSourceRef.current = "keyboard";
    arrowDirectionRef.current = key;

    if (key === "ArrowUp") {
      setSelectedOptionIndex(prev =>
        prev === 0 ? searchedOptionsList.length - 1 : prev - 1
      );
      return;
    }

    setSelectedOptionIndex(prev =>
      prev === searchedOptionsList.length - 1 ? 0 : prev + 1
    );
  };

  // 키보드로 재능 선택할 때 스크롤 이동
  useEffect(() => {
    if (inputSourceRef.current === "mouse" || !selectedTalentRef.current) {
      return;
    }

    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (!selectedTalentRef.current) {
            return;
          }

          if (!entry.isIntersecting) {
            selectedTalentRef.current.scrollIntoView({
              block:
                arrowDirectionRef.current === "ArrowDown" ? "end" : undefined
            });
          }
        });
      },
      {
        root: null,
        rootMargin: "0px",
        threshold: 1
      }
    );

    observer.observe(selectedTalentRef.current);

    return () => observer.disconnect();
  }, [selectedOptionIndex]);

  useEffect(() => {
    // 기본 or 메인 옵션 스크롤 바 스타일 적용
    if (
      !scrollRefArray.current[0] ||
      !scrollRefArray.current[0].parentElement
    ) {
      return;
    }

    const { parentElement, scrollHeight } = scrollRefArray.current[0];
    const isScrollable = scrollHeight > parentElement.offsetHeight;
    const dividerStyle = hasSubOption ? styles.middleDivider : styles.divider;

    parentElement.classList.toggle(dividerStyle, isScrollable);
  }, [hasSubOption, isOpen, search]);

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

    parentElement.classList.toggle(styles.divider, isScrollable);
    scrollRefArray.current[1].scrollTo({ top: 0 });
  }, [selectedCategoryIndex, isOpen, search]);

  useEffect(() => {
    // 검색한 옵션 스크롤 바 스타일, 스크롤 위치 변경
    if (
      !scrollRefArray.current[2] ||
      !scrollRefArray.current[2].parentElement ||
      !search
    ) {
      return;
    }

    const { parentElement, scrollHeight } = scrollRefArray.current[2];
    const isScrollable = scrollHeight > parentElement.offsetHeight;

    parentElement.classList.toggle(styles.divider, isScrollable);
    parentElement.classList.remove(styles.middleDivider);
    scrollRefArray.current[2].scrollTo({ top: 0 });
    setSelectedOptionIndex(0);
  }, [isOpen, search]);

  return (
    <div className={"relative w-[388px]"}>
      <label
        className={classNames(
          "peer/label group/label",
          "flex items-center",
          "rounded-lg border border-talearnt_Line_01 px-[15px] py-[10px]",
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
                "rounded-[6px] bg-talearnt_BG_Up_02 px-2 py-[5px]"
              )}
              key={String(value)}
            >
              <span className={"text-body3_14_medium"}>{label}</span>
              <CloseIcon size={16} />
            </div>
          ))}
          <AutoResizeInput
            className={classNames(
              "flex-1",
              "text-body2_16_medium",
              "focus:outline-none"
            )}
            onClick={({ target }) => {
              setValue("checkbox", !isOpen);

              if (isOpen) {
                (target as HTMLInputElement).blur();
              }
            }}
            onChange={({ target }) => setValue("search", target.value)}
            onKeyDown={handleKeyDown}
            placeholder={
              selectedOptionsArray.length === 0 ? placeholder : undefined
            }
            autoComplete={"off"}
          />
        </div>
        <CaretIcon
          className={classNames(
            "shrink-0",
            "stroke-talearnt_Icon_03",
            "group-hover/label:stroke-talearnt_Icon_01",
            isOpen && "rotate-180 stroke-talearnt_Icon_01"
          )}
        />
      </label>
      {/*드롭다운 옵션*/}
      <div
        className={classNames(
          "absolute hidden",
          "mt-2 max-h-[298px] w-full rounded-lg",
          "border border-talearnt_Line_01 bg-talearnt_BG_Background shadow-[0_0_20px_0_rgba(0,0,0,0.08)]",
          "peer-has-[:checked]/label:flex"
        )}
      >
        {!search ? (
          <>
            <div
              className={optionsStyle}
              ref={element => (scrollRefArray.current = [element])}
            >
              {options.map(({ label, value }, index) =>
                hasSubOption ? (
                  <button
                    className={classNames(
                      optionItemStyle,
                      "group/item",
                      "hover:bg-talearnt_BG_Up_01 hover:text-talearnt_Text_02",
                      index === selectedCategoryIndex &&
                        "bg-talearnt_BG_Up_01 text-body2_16_semibold text-talearnt_Text_01"
                    )}
                    onClick={() => setValue("selectedCategoryIndex", index)}
                    key={`main-option-${label}`}
                  >
                    <div className={"flex items-center justify-between"}>
                      {label}
                      <CaretIcon
                        className={classNames(
                          "stroke-talearnt_Icon_03",
                          "group-hover/item:stroke-talearnt_Icon_01",
                          index === selectedCategoryIndex &&
                            "stroke-talearnt_Icon_01"
                        )}
                        direction={"right"}
                      />
                    </div>
                  </button>
                ) : (
                  <DropdownOptionItem
                    className={classNames(
                      "text-body2_16_medium",
                      isOptionSelected(value as T) && "text-body2_16_semibold"
                    )}
                    checked={isOptionSelected(value as T)}
                    onChangeHandler={handleOnChange({
                      label,
                      value: value as T
                    })}
                    label={label}
                    key={String(value)}
                  />
                )
              )}
            </div>
            {/*서브 옵션*/}
            {hasSubOption && (
              <div
                className={optionsStyle}
                ref={element => (scrollRefArray.current[1] = element)}
              >
                {selectedCategoryIndex !== undefined &&
                  (
                    options[selectedCategoryIndex]
                      .value as dropdownOptionType<T>[]
                  ).map(({ label, value }) => (
                    <DropdownOptionItem
                      className={classNames(
                        "text-body2_16_medium",
                        isOptionSelected(value) && "text-body2_16_semibold"
                      )}
                      checked={isOptionSelected(value)}
                      onChangeHandler={handleOnChange({ label, value })}
                      label={label}
                      key={`sub-option-${label}`}
                    />
                  ))}
              </div>
            )}
          </>
        ) : (
          <div
            className={classNames(
              optionsStyle,
              searchedOptionsList.length === 0 &&
                "h-[298px] items-center justify-center gap-4"
            )}
            ref={element => (scrollRefArray.current[2] = element)}
          >
            {searchedOptionsList.length > 0 ? (
              searchedOptionsList.map(({ label, value }, index) => (
                <button
                  ref={
                    selectedOptionIndex === index
                      ? selectedTalentRef
                      : undefined
                  }
                  className={classNames(
                    optionItemStyle,
                    index === selectedOptionIndex &&
                      "bg-talearnt_BG_Up_01 text-talearnt_Text_02"
                  )}
                  onClick={() => {
                    handleOnChange({ label, value });
                    setValue("search", "");
                  }}
                  onMouseEnter={() => {
                    inputSourceRef.current = "mouse";
                    setSelectedOptionIndex(index);
                  }}
                  key={`search-option-${label}`}
                >
                  {label}
                </button>
              ))
            ) : (
              <>
                <span
                  className={"text-heading4_20_semibold text-talearnt_Text_03"}
                >
                  이 키워드는 없어요...
                </span>
                <MakoExpressionSad />
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export { SearchableDropdown };
