import { KeyboardEvent, useEffect, useMemo, useRef, useState } from "react";

import { useForm } from "react-hook-form";
import { useShallow } from "zustand/shallow";

import { classNames } from "@shared/utils/classNames";
import { findTalentList } from "@shared/utils/findTalent";

import { useDebounce } from "@shared/hooks/useDebounce";

import { useTalentsSettingModalStore } from "@features/talentsSettingModal/talentsSettingModal.store";
import { useToastStore } from "@store/toast.store";

import { Badge } from "@components/common/Badge/Badge";
import { Chip } from "@components/common/Chip/Chip";
import { DropdownFixedLabel } from "@components/common/dropdowns/DropdownFixedLabel/DropdownFixedLabel";
import { DropdownOptionItem } from "@components/common/dropdowns/DropdownOptionItem/DropdownOptionItem";
import { EmptySearchOption } from "@components/common/EmptySearchOption/EmptySearchOption";
import { CircleCheckIcon } from "@components/common/icons/CircleCheckIcon/CircleCheckIcon";
import { SearchIcon } from "@components/common/icons/SearchIcon/SearchIcon";
import { Input } from "@components/common/inputs/Input/Input";
import { ModalBody } from "@components/common/modal/parts/ModalBody";

import { CURRENT_TALENTS_TYPE_NAME } from "@features/talentsSettingModal/talentsSettingModal.constants";
import {
  CATEGORIZED_TALENTS_DROPDOWN_OPTIONS,
  TALENTS_LIST,
} from "@shared/constants/talentsList";

import { talentsType } from "@features/talentsSettingModal/talentsSettingModal.type";

function TalentsSettingModalBody() {
  // 현재 눌린 키보드의 방향
  const arrowDirectionRef = useRef<"ArrowUp" | "ArrowDown">("ArrowUp");
  // 키보드, 마우스 어떤 source 선택하는지 저장
  const inputSourceRef = useRef<"keyboard" | "mouse">("keyboard");
  // 현재 선택된 재능
  const selectedTalentRef = useRef<HTMLButtonElement>(null);

  const { register, reset, watch } = useForm<{ search: string }>();

  const {
    scrollRef,
    currentTalentsType,
    talentsData,
    isSuccess,
    setTalentsData,
  } = useTalentsSettingModalStore(
    useShallow(state => ({
      scrollRef: state.scrollRef,
      currentTalentsType: state.currentTalentsType,
      talentsData: state.talentsData,
      isSuccess: state.isSuccess,
      setTalentsData: state.setTalentsData,
    }))
  );
  const setToast = useToastStore(state => state.setToast);

  // 현재 선택된 재능의 index
  const [selectedTalentIndex, setSelectedTalentIndex] = useState(0);

  // 검색한 값
  const search = useDebounce(watch("search"));
  const currentTalentsList = findTalentList(talentsData[currentTalentsType]);
  const giveTalentsList = findTalentList(talentsData.giveTalents);
  const receiveTalentsList = findTalentList(talentsData.receiveTalents);
  // 검색한 재능 키워드 목록
  const searchedTalentsList = useMemo(() => {
    if (!search) {
      return [];
    }

    // 검색한 값으로 공백 제거, 대소문자 구분 X 정규식 생성
    const searchRegex = new RegExp(search.replace(/\s+/g, ""), "i");

    return TALENTS_LIST.filter(
      ({ talentCode, talentName }) =>
        searchRegex.test(talentName.replace(/\s+/g, "")) &&
        !talentsData[currentTalentsType].some(code => code === talentCode)
    );
  }, [currentTalentsType, search, talentsData]);

  // 키워드가 최대 개수라면 토스트 노출
  const isTalentsExceedingLimit = () => {
    if (talentsData[currentTalentsType].length < 5) {
      return false;
    }

    setToast({
      message: "재능 키워드는 5개까지만 선택 가능해요",
      type: "error",
    });

    return true;
  };
  // 키보드로 재능을 선택
  const handleKeyDown = ({
    key,
    nativeEvent,
  }: KeyboardEvent<HTMLInputElement>) => {
    if (nativeEvent.isComposing || !search) {
      // 아직 글자가 조합중인 상태라면 return (한글 이슈)
      return;
    }

    if (key === "Enter") {
      if (isTalentsExceedingLimit()) {
        return;
      }

      const { talentCode } = searchedTalentsList[selectedTalentIndex];

      setTalentsData({
        type: "add",
        talentCode,
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
                arrowDirectionRef.current === "ArrowDown" ? "end" : undefined,
            });
          }
        });
      },
      {
        root: null,
        rootMargin: "0px",
        threshold: 1,
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
            {(Object.keys(talentsData) as talentsType[]).map(key => (
              <div className={"flex flex-col gap-2"} key={key}>
                <h3 className={"text-caption1_14_medium text-talearnt_Text_03"}>
                  {CURRENT_TALENTS_TYPE_NAME[key]} 키워드
                </h3>
                <div className={"flex flex-wrap gap-2"}>
                  {(key === "giveTalents"
                    ? giveTalentsList
                    : receiveTalentsList
                  ).map(({ talentCode, talentName }) => (
                    <Badge
                      label={talentName}
                      type={"keyword"}
                      size={"medium"}
                      key={`${key}-${talentCode}`}
                    />
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
              "scrollbar scrollbar-w12-10 overflow-y-scroll",
              search &&
                searchedTalentsList.length === 0 &&
                "h-full items-center justify-center gap-4"
            )}
            ref={scrollRef}
          >
            {!search ? (
              // 검색을 하지 않은 경우
              CATEGORIZED_TALENTS_DROPDOWN_OPTIONS.map(
                ({ categoryCode, categoryName, options }) => (
                  <DropdownFixedLabel<number>
                    title={categoryName}
                    options={options}
                    onSelectHandler={({ checked, value }) => {
                      if (checked) {
                        if (isTalentsExceedingLimit()) {
                          return;
                        }
                      }

                      setTalentsData({
                        type: checked ? "add" : "remove",
                        talentCode: value,
                      });
                    }}
                    selectedValueArray={talentsData[currentTalentsType]}
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
                      talentCode,
                    });
                    reset();
                  }}
                  onMouseEnter={() => {
                    inputSourceRef.current = "mouse";
                    setSelectedTalentIndex(index);
                  }}
                  hasHoverStyle={false}
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
              {currentTalentsList.map(({ talentCode, talentName }) => (
                <Chip
                  onCloseHandler={() =>
                    setTalentsData({
                      type: "remove",
                      talentCode,
                    })
                  }
                  type={"keyword"}
                  key={`${currentTalentsType}-${talentCode}`}
                >
                  {talentName}
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
