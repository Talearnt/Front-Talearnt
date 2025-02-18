import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState
} from "react";

import { useForm } from "react-hook-form";

import { classNames } from "@utils/classNames";

import useDebounce from "@hook/useDebounce";

import { Chip } from "@components/Chip/Chip";
import { DropdownOptionCheckbox } from "@components/dropdowns/DropdownOptionCheckbox/DropdownOptionCheckbox";
import { DropdownOptionItem } from "@components/dropdowns/DropdownOptionItem/DropdownOptionItem";
import { EmptySearchOption } from "@components/EmptySearchOption/EmptySearchOption";
import { CaretIcon } from "@components/icons/caret/CaretIcon/CaretIcon";
import { ErrorIcon } from "@components/icons/ErrorIcon/ErrorIcon";
import { AutoResizeInput } from "@components/inputs/AutoResizeInput/AutoResizeInput";

import { dropdownOptionType } from "@components/dropdowns/dropdown.type";

type SearchableDropdownProps<T> = {
  error?: string;
  isMultiple?: boolean;
  options: dropdownOptionType<T | dropdownOptionType<T>[]>[];
  onSelectHandler: ({
    checked,
    value
  }: { checked: boolean } & dropdownOptionType<T>) => void;
  placeholder?: string;
  selectedValue: T[] | T;
};

const optionsStyle = classNames(
  "flex flex-col gap-2",
  "p-[7px] w-full",
  "scrollbar scrollbar-w10 overflow-y-auto"
);

function SearchableDropdown<T = string>({
  error,
  isMultiple = true,
  options,
  onSelectHandler,
  placeholder,
  selectedValue
}: SearchableDropdownProps<T>) {
  // 현재 눌린 키보드의 방향
  const arrowDirectionRef = useRef<"ArrowUp" | "ArrowDown">("ArrowUp");
  // 키보드, 마우스 어떤 source 선택하는지 저장
  const inputSourceRef = useRef<"keyboard" | "mouse">("keyboard");
  // 현재 선택된 재능
  const selectedTalentRef = useRef<HTMLButtonElement>(null);
  const scrollRefArray = useRef<(HTMLDivElement | null)[]>([]);
  const wrapperRef = useRef<HTMLDivElement>(null);

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
  const hasSubOption = useMemo(
    () => Array.isArray(options[0]?.value),
    [options]
  );
  const finalOptions = useMemo(
    () =>
      hasSubOption
        ? options.flatMap(({ value }) => value as dropdownOptionType<T>[])
        : options,
    [hasSubOption, options]
  ) as dropdownOptionType<T>[];
  const search = useDebounce(watch("search"));
  // 옵션이 선택되었는지 확인
  const isOptionSelected = useCallback(
    (value: T) =>
      isMultiple
        ? (selectedValue as T[]).some(selectedValue => selectedValue === value)
        : selectedValue === value,
    [isMultiple, selectedValue]
  );
  // 검색한 옵션 목록
  const searchedOptionsList = useMemo(() => {
    if (!search) {
      return [];
    }

    // 검색한 값으로 공백 제거, 대소문자 구분 X 정규식 생성
    const searchRegex = new RegExp(search.replace(/\s+/g, ""), "i");

    return finalOptions.filter(
      ({ label, value }) =>
        searchRegex.test(label.replace(/\s+/g, "")) && !isOptionSelected(value)
    );
  }, [finalOptions, isOptionSelected, search]);
  // 선택한 옵션 목록
  const selectedOptionsList = useMemo(
    () => finalOptions.filter(({ value }) => isOptionSelected(value)),
    [finalOptions, isOptionSelected]
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
      onSelectHandler({
        checked: true,
        ...searchedOptionsList[selectedOptionIndex]
      });

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
    // 드롭다운 옵션 닫히면 스크롤 초기화
    if (!isOpen) {
      setValue("selectedCategoryIndex", undefined);

      return;
    }

    scrollRefArray.current.forEach(scrollRef => {
      scrollRef?.scrollTo({ top: 0 });
    });
  }, [isOpen, setValue, search, selectedCategoryIndex]);
  useEffect(() => {
    // 다른 영역 클릭 시 초기화
    const handleClose = (e: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(e.target as Node)
      ) {
        setValue("checkbox", false);
      }
    };

    window.addEventListener("mousedown", handleClose);

    return () => {
      window.removeEventListener("mousedown", handleClose);
    };
  }, [setValue]);

  return (
    <div ref={wrapperRef} className={classNames("relative", "w-[388px]")}>
      <label
        className={classNames(
          "peer/label group/label",
          "flex items-center",
          "min-h-[50px] rounded-lg border border-talearnt_Line_01 px-[15px] py-[10px]",
          "cursor-pointer",
          !!error && "border-talearnt_Error_01"
        )}
      >
        <input
          {...register("checkbox")}
          className={"hidden"}
          type={"checkbox"}
        />
        <div className={classNames("flex flex-wrap gap-2", "w-full min-w-0")}>
          {/*선택한 값 버튼칩*/}
          {selectedOptionsList.map(({ label, value }) => (
            <Chip
              onCloseHandler={e => {
                e.preventDefault();

                onSelectHandler({
                  checked: false,
                  label,
                  value
                });
              }}
              type={"keyword"}
              key={`selected-${String(value)}`}
            >
              {label}
            </Chip>
          ))}
          <AutoResizeInput
            className={classNames(
              "flex-1",
              "h-[30.2px] text-body2_16_medium",
              "focus:outline-none"
            )}
            formData={{ ...register("search") }}
            onClick={() => {
              if (!isOpen) {
                setValue("checkbox", !isOpen);
              }
            }}
            onKeyDown={handleKeyDown}
            placeholder={
              (isMultiple && (selectedValue as T[]).length === 0) ||
              (!isMultiple && !selectedValue)
                ? placeholder
                : undefined
            }
            value={search}
            autoComplete={"off"}
          />
        </div>
        <CaretIcon
          className={classNames(
            "shrink-0",
            "group-hover/label:stroke-talearnt_Icon_01",
            isOpen && "-rotate-90 stroke-talearnt_Icon_01"
          )}
          direction={"bottom"}
        />
      </label>
      {/*드롭다운 옵션*/}
      <div
        className={classNames(
          "absolute hidden",
          "mt-1 max-h-[298px] w-full rounded-lg",
          "z-10 border border-talearnt_Line_01 bg-talearnt_BG_Background shadow-shadow_02",
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
                  <DropdownOptionItem
                    checked={index === selectedCategoryIndex}
                    label={label}
                    onClick={() => setValue("selectedCategoryIndex", index)}
                    hasHoverStyle
                    key={`main-option-${label}`}
                  >
                    <CaretIcon
                      className={classNames(
                        index !== selectedCategoryIndex &&
                          "group-hover/button:stroke-talearnt_Icon_01"
                      )}
                    />
                  </DropdownOptionItem>
                ) : isMultiple ? (
                  <DropdownOptionCheckbox
                    checked={isOptionSelected(value as T)}
                    onChangeHandler={({ target }) => {
                      onSelectHandler({
                        checked: target.checked,
                        label,
                        value: value as T
                      });
                    }}
                    label={label}
                    key={`main-option-${label}`}
                  />
                ) : (
                  <DropdownOptionItem
                    checked={isOptionSelected(value as T)}
                    onClick={() => {
                      onSelectHandler({
                        checked: true,
                        label,
                        value: value as T
                      });
                    }}
                    label={label}
                    hasHoverStyle
                    key={`main-option-${label}`}
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
                  ).map(({ label, value }) =>
                    isMultiple ? (
                      <DropdownOptionCheckbox
                        checked={isOptionSelected(value)}
                        onChangeHandler={({ target }) => {
                          onSelectHandler({
                            checked: target.checked,
                            label,
                            value
                          });
                        }}
                        label={label}
                        key={`sub-option-${label}`}
                      />
                    ) : (
                      <DropdownOptionItem
                        checked={isOptionSelected(value)}
                        onClick={() => {
                          onSelectHandler({
                            checked: true,
                            label,
                            value
                          });
                        }}
                        label={label}
                        hasHoverStyle
                        key={`sub-option-${label}`}
                      />
                    )
                  )}
              </div>
            )}
          </>
        ) : (
          <div
            className={classNames(
              optionsStyle,
              searchedOptionsList.length === 0 &&
                "h-[298px] items-center justify-center gap-4 px-4"
            )}
            ref={element => (scrollRefArray.current[2] = element)}
          >
            {searchedOptionsList.length > 0 ? (
              searchedOptionsList.map(({ label, value }, index) => (
                <DropdownOptionItem
                  buttonRef={
                    selectedOptionIndex === index
                      ? selectedTalentRef
                      : undefined
                  }
                  checked={index === selectedOptionIndex}
                  label={label}
                  onClick={() => {
                    onSelectHandler({
                      checked: true,
                      label,
                      value
                    });
                  }}
                  onMouseEnter={() => {
                    inputSourceRef.current = "mouse";
                    setSelectedOptionIndex(index);
                  }}
                  key={`search-option-${label}`}
                />
              ))
            ) : (
              <EmptySearchOption search={search} />
            )}
          </div>
        )}
      </div>
      {!!error && (
        <div className={"mt-1 flex items-center gap-1"}>
          <ErrorIcon />
          <span className={"text-caption1_14_medium text-talearnt_Error_01"}>
            {error}
          </span>
        </div>
      )}
    </div>
  );
}

export { SearchableDropdown };
