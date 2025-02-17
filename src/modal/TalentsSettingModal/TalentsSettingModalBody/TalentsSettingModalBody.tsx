import React, { useEffect, useMemo, useRef, useState } from "react";

import { useForm } from "react-hook-form";

import { classNames } from "@utils/classNames";

import useDebounce from "@hook/useDebounce";

import { useToastStore } from "@common/common.store";
import { useTalentsSettingModalStore } from "@modal/TalentsSettingModal/core/talentsSettingModal.store";

import { Chip } from "@components/Chip/Chip";
import { DropdownOptionItem } from "@components/dropdowns/DropdownOptionItem/DropdownOptionItem";
import { MultiSelectDropdown } from "@components/dropdowns/MultiSelectDropdown/MultiSelectDropdown";
import { EmptySearchOption } from "@components/EmptySearchOption/EmptySearchOption";
import { CircleCheckIcon } from "@components/icons/CircleCheckIcon/CircleCheckIcon";
import { SearchIcon } from "@components/icons/SearchIcon/SearchIcon";
import { Input } from "@components/inputs/Input/Input";
import { ModalBody } from "@components/modal/ModalBody/ModalBody";

import { CATEGORIZED_TALENTS_LIST } from "@common/common.constants";
import { CURRENT_TALENTS_TYPE_NAME } from "@modal/TalentsSettingModal/core/talentsList.constants";

import { talentsType } from "@modal/TalentsSettingModal/core/talentsSettingModal.type";

function TalentsSettingModalBody() {
  // 현재 눌린 키보드의 방향
  const arrowDirectionRef = useRef<"ArrowUp" | "ArrowDown">("ArrowUp");
  // 키보드, 마우스 어떤 source 선택하는지 저장
  const inputSourceRef = useRef<"keyboard" | "mouse">("keyboard");
  // 현재 선택된 재능
  const selectedTalentRef = useRef<HTMLButtonElement>(null);

  const { register, reset, watch } = useForm<{ search: string }>();

  const scrollRef = useTalentsSettingModalStore(state => state.scrollRef);
  const currentTalentsType = useTalentsSettingModalStore(
    state => state.currentTalentsType
  );
  const talentsData = useTalentsSettingModalStore(state => state.talentsData);
  const isSuccess = useTalentsSettingModalStore(state => state.isSuccess);
  const setTalentsData = useTalentsSettingModalStore(
    state => state.setTalentsData
  );
  const setToast = useToastStore(state => state.setToast);

  // 현재 선택된 재능의 index
  const [selectedTalentIndex, setSelectedTalentIndex] = useState(0);

  // 검색한 값
  const search = useDebounce(watch("search"));
  // 검색한 재능 키워드 목록
  const searchedTalentsList = useMemo(() => {
    if (!search) {
      return [];
    }

    // 검색한 값으로 공백 제거, 대소문자 구분 X 정규식 생성
    const searchRegex = new RegExp(search.replace(/\s+/g, ""), "i");

    return CATEGORIZED_TALENTS_LIST.flatMap(({ talents }) =>
      talents.filter(
        ({ talentCode, talentName }) =>
          searchRegex.test(talentName.replace(/\s+/g, "")) &&
          !talentsData[currentTalentsType].some(
            ({ value }) => value === talentCode
          )
      )
    );
  }, [currentTalentsType, search, talentsData]);
  // 선택된 값 배열
  const selectedValueArray = useMemo(
    () => talentsData[currentTalentsType].map(({ value }) => value),
    [currentTalentsType, talentsData]
  );

  // 키워드가 최대 개수라면 토스트 노출
  const isTalentsExceedingLimit = () => {
    if (talentsData[currentTalentsType].length < 5) {
      return false;
    }

    setToast({
      message: "재능 키워드는 5개까지만 선택 가능해요",
      type: "error"
    });

    return true;
  };
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
      if (isTalentsExceedingLimit()) {
        return;
      }

      const { talentCode, talentName } =
        searchedTalentsList[selectedTalentIndex];

      setTalentsData({
        type: "add",
        talent: { label: talentName, value: talentCode }
      });
      reset();

      return;
    }

    if (key !== "ArrowUp" && key !== "ArrowDown") {
      return;
    }
    inputSourceRef.current = "keyboard";
    arrowDirectionRef.current = key;

    if (key === "ArrowUp") {
      setSelectedTalentIndex(prev =>
        prev === 0 ? searchedTalentsList.length - 1 : prev - 1
      );
      return;
    }

    setSelectedTalentIndex(prev =>
      prev === searchedTalentsList.length - 1 ? 0 : prev + 1
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
  }, [selectedTalentIndex]);
  // 검색어 변하면 index, 스크롤 초기화
  useEffect(() => {
    if (!scrollRef.current) {
      return;
    }

    setSelectedTalentIndex(0);
    scrollRef.current.scrollTo({ top: 0 });
  }, [scrollRef, search]);

  return (
    <ModalBody className={"gap-6"}>
      {isSuccess ? (
        <>
          <CircleCheckIcon
            className={classNames("mx-auto mb-2", "stroke-talearnt_Primary_01")}
            size={70}
          />
          <div className={classNames("flex flex-col gap-6", "px-[30px]")}>
            {Object.keys(talentsData).map(key => (
              <div className={"flex flex-col gap-2"} key={key}>
                <h3 className={"text-caption1_14_medium text-talearnt_Text_03"}>
                  {CURRENT_TALENTS_TYPE_NAME[key as talentsType]} 키워드
                </h3>
                <div className={"flex flex-wrap gap-2"}>
                  {talentsData[key as talentsType].map(({ label, value }) => (
                    <span
                      className={classNames(
                        "flex items-center",
                        "h-[40px] rounded-[6px] bg-talearnt_BG_Up_02 px-4",
                        "whitespace-nowrap text-body2_16_medium text-talearnt_Text_02"
                      )}
                      key={value}
                    >
                      {label}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        <>
          <Input
            className={classNames(
              "rounded-full border-talearnt_Line_01",
              "text-caption1_14_medium"
            )}
            onKeyDown={handleKeyDown}
            formData={{ ...register("search") }}
            placeholder={"원하는 키워드를 검색해 보세요."}
            wrapperClassName={classNames("relative px-[30px]")}
            autoComplete={"off"}
          >
            <SearchIcon
              className={classNames(
                "absolute right-4 top-[13px]",
                "cursor-pointer fill-transparent",
                "peer-hover/input:stroke-talearnt_Primary_01 peer-focus/input:stroke-talearnt_Primary_01"
              )}
            />
          </Input>
          <div
            className={classNames(
              "flex flex-col",
              "h-[344px] pl-[32px]",
              "scrollbar scrollbar-w12 overflow-y-scroll",
              search &&
                searchedTalentsList.length === 0 &&
                "h-full items-center justify-center gap-4"
            )}
            ref={scrollRef}
          >
            {!search ? (
              // 검색을 하지 않은 경우
              CATEGORIZED_TALENTS_LIST.map(
                ({ categoryCode, categoryName, talents }) => (
                  <MultiSelectDropdown<number>
                    title={categoryName}
                    options={talents.map(({ talentCode, talentName }) => ({
                      label: talentName,
                      value: talentCode
                    }))}
                    onSelectHandler={({ checked, label, value }) => {
                      if (checked) {
                        if (isTalentsExceedingLimit()) {
                          return;
                        }
                      }

                      setTalentsData({
                        type: checked ? "add" : "remove",
                        talent: { label, value }
                      });
                    }}
                    selectedValueArray={selectedValueArray}
                    key={categoryCode}
                  />
                )
              )
            ) : searchedTalentsList.length > 0 ? (
              // 검색한 결과가 있는 경우
              searchedTalentsList.map(({ talentCode, talentName }, index) => (
                <DropdownOptionItem
                  buttonRef={
                    selectedTalentIndex === index
                      ? selectedTalentRef
                      : undefined
                  }
                  checked={index === selectedTalentIndex}
                  label={talentName}
                  onClick={() => {
                    if (isTalentsExceedingLimit()) {
                      return;
                    }

                    setTalentsData({
                      type: "add",
                      talent: {
                        label: talentName,
                        value: talentCode
                      }
                    });
                    reset();
                  }}
                  onMouseEnter={() => {
                    inputSourceRef.current = "mouse";
                    setSelectedTalentIndex(index);
                  }}
                  key={talentCode}
                />
              ))
            ) : (
              // 검색한 결과가 없는 경우
              <EmptySearchOption search={search} />
            )}
          </div>
          {talentsData[currentTalentsType].length > 0 && (
            <div className={classNames("flex flex-wrap gap-2", "px-[30px]")}>
              {talentsData[currentTalentsType].map(({ label, value }) => (
                <Chip
                  onCloseHandler={() =>
                    setTalentsData({
                      type: "remove",
                      talent: { label, value }
                    })
                  }
                  type={"keyword"}
                  key={value}
                >
                  {label}
                </Chip>
              ))}
            </div>
          )}
        </>
      )}
    </ModalBody>
  );
}

export { TalentsSettingModalBody };
