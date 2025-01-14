import { useEffect, useMemo, useRef, useState } from "react";
import { useForm } from "react-hook-form";

import { yupResolver } from "@hookform/resolvers/yup";
import { object, string } from "yup";

import { postTalents } from "@modal/TalentsSettingModal/talentsSettingModal.api";

import { checkObjectType } from "@utils/checkObjectType";
import { classNames } from "@utils/classNames";

import useDebounce from "@hook/useDebounce";

import { useToastStore } from "@common/common.store";

import { Button } from "@components/Button/Button";
import { CircleCheckIcon } from "@components/icons/CircleCheckIcon/CircleCheckIcon";
import { CloseIcon } from "@components/icons/CloseIcon/CloseIcon";
import { SearchIcon } from "@components/icons/SearchIcon/SearchIcon";
import { Input } from "@components/Input/Input";
import { ModalBody } from "@components/modal/ModalBody/ModalBody";
import { ModalBottom } from "@components/modal/ModalBottom/ModalBottom";
import { ModalBox } from "@components/modal/ModalBox/ModalBox";
import { ModalContainer } from "@components/modal/ModalContainer/ModalContainer";
import { ModalHeader } from "@components/modal/ModalHeader/ModalHeader";
import { MultiSelectDropdown } from "@components/MultiSelectDropdown/MultiSelectDropdown";
import { Spinner } from "@components/Spinner/Spinner";

import { CATEGORIZED_TALENTS_LIST } from "@modal/TalentsSettingModal/talentsList.constants";

import { talentsType } from "@modal/TalentsSettingModal/talentsSettingModal.type";

import styles from "./TalentsSettingModal.module.css";

const talentsName: Record<talentsType, string> = {
  giveTalents: "나의 재능",
  receiveTalents: "관심있는 재능"
};
const talentsSearchSchema = object({
  search: string()
}).required();

function TalentsSettingModal() {
  const scrollRef = useRef<HTMLDivElement>(null);

  const { setValue, register, watch } = useForm({
    mode: "onChange",
    resolver: yupResolver(talentsSearchSchema)
  });

  const { setToast } = useToastStore();

  const [currentTalentsType, setCurrentTalentsType] =
    useState<talentsType>("giveTalents");
  const [talentsData, setTalentsData] = useState<
    Record<talentsType, { label: string; value: number }[]>
  >({
    giveTalents: [],
    receiveTalents: []
  });
  const [status, setStatus] = useState<"default" | "loading" | "success">(
    "default"
  );

  const isLoading = status === "loading";
  const isSuccess = status === "success";
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

  // 다음/이전 누를 때 드롭다운 닫힘 처리, 스크롤 최상단 이동
  const handleTypeChange = (type: talentsType) => {
    if (!scrollRef.current) {
      return;
    }

    // scrollRef 아래 있는 드롭다운 inputs
    const inputs = scrollRef.current.querySelectorAll('input[type="checkbox"]');

    // 모두 닫힘 처리
    inputs.forEach(input => {
      (input as HTMLInputElement).checked = false;
    });
    // 스크롤 최상단으로 이동
    scrollRef.current.scrollTo({ top: 0 });
    setCurrentTalentsType(type);
  };
  // 재능 추가, 제거
  const handleTalentChange = (
    checked: boolean,
    talent: { label: string; value: number }
  ) => {
    if (checked) {
      setTalentsData(prev => ({
        ...prev,
        [currentTalentsType]: [...prev[currentTalentsType], talent]
      }));
    } else {
      setTalentsData(prev => ({
        ...prev,
        [currentTalentsType]: prev[currentTalentsType].filter(
          ({ value: talentCode }) => talentCode !== talent.value
        )
      }));
    }
  };
  // 재능 설정
  const handleConfirm = async () => {
    if (isLoading) {
      return;
    }

    setStatus("loading");

    try {
      await postTalents({
        giveTalents: talentsData.giveTalents.map(({ value }) => value),
        receiveTalents: talentsData.receiveTalents.map(({ value }) => value)
      });
      setStatus("success");
    } catch (e) {
      setStatus("default");
      if (checkObjectType(e) && "errorCode" in e) {
        setToast({
          message: e.errorMessage as string,
          type: "error"
        });
        return;
      }

      setToast({
        message: "예기치 못한 오류가 발생했습니다.",
        type: "error"
      });
    }
  };

  useEffect(() => {
    if (!scrollRef.current || !scrollRef.current.parentElement) {
      return;
    }

    // 스크롤 가능 여부
    const isScrollable =
      scrollRef.current.scrollHeight >
      scrollRef.current.parentElement.clientHeight;

    if (isScrollable) {
      scrollRef.current.classList.add(styles.divider);
    } else {
      scrollRef.current.classList.remove(styles.divider);
    }
  }, [search]);

  return (
    <ModalContainer>
      <ModalBox>
        <ModalHeader>
          <div className={"flex flex-col items-center gap-1"}>
            <h1 className={"text-2xl font-semibold text-talearnt-Text_Strong"}>
              {isSuccess
                ? "맞춤 키워드 등록이 완료되었습니다."
                : `${talentsName[currentTalentsType]} 키워드를 선택해 주세요!`}
            </h1>
            <h2 className={"text-base font-medium text-talearnt-Text_03"}>
              {isSuccess
                ? "이제 서로의 재능들을 교환해 보세요!"
                : "(최대 5개까지 선택 가능해요)"}
            </h2>
          </div>
        </ModalHeader>
        <ModalBody className={"gap-6"}>
          {isSuccess ? (
            <>
              <CircleCheckIcon
                className={"mx-auto mb-2 stroke-talearnt-Primary_01"}
                size={70}
              />
              <div className={"flex flex-col gap-6 px-[30px]"}>
                {Object.keys(talentsData).map(key => (
                  <div className={"flex flex-col gap-2"}>
                    <h3 className={"text-sm font-medium text-talearnt-Text_03"}>
                      {talentsName[key as talentsType]} 키워드
                    </h3>
                    <div className={"flex flex-wrap gap-2"}>
                      {talentsData[key as talentsType].map(
                        ({ label, value }) => (
                          <span
                            className={classNames(
                              "flex items-center",
                              "h-[40px] rounded-[6px] bg-talearnt-BG_Up_02 px-4",
                              "whitespace-nowrap text-base font-medium text-talearnt-Text_02"
                            )}
                            key={value}
                          >
                            {label}
                          </span>
                        )
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <>
              <Input
                className={classNames(
                  "rounded-full border-talearnt-Line_01 text-sm font-medium"
                )}
                formData={{ ...register("search") }}
                placeholder={"원하는 키워드를 검색해 보세요."}
                wrapperClassName={classNames("relative px-[30px]")}
              >
                <SearchIcon
                  className={classNames(
                    "absolute right-4 top-[13px]",
                    "cursor-pointer fill-transparent",
                    "peer-focus/input:stroke-talearnt-Primary_01"
                  )}
                />
              </Input>
              <div
                className={classNames(
                  "mr-[10px] h-[344px] pl-[32px] pr-[10px]",
                  "overflow-y-scroll",
                  styles.scrollbar
                )}
              >
                <div className={"flex flex-col"} ref={scrollRef}>
                  {!search ? (
                    // 검색을 하지 않은 경우
                    CATEGORIZED_TALENTS_LIST.map(
                      ({ categoryCode, categoryName, talents }) => (
                        <MultiSelectDropdown<number>
                          title={categoryName}
                          options={talents.map(
                            ({ talentCode, talentName }) => ({
                              label: talentName,
                              value: talentCode
                            })
                          )}
                          onSelectHandler={({ checked, label, value }) => {
                            if (
                              talentsData[currentTalentsType].length > 4 &&
                              checked
                            ) {
                              return;
                            }

                            handleTalentChange(checked, { label, value });
                          }}
                          selectedValueArray={selectedValueArray}
                          key={categoryCode}
                        />
                      )
                    )
                  ) : searchedTalentsList.length > 0 ? (
                    // 검색한 결과가 있는 경우
                    searchedTalentsList.map(({ talentCode, talentName }) => (
                      <button
                        className={classNames(
                          "flex-shrink-0",
                          "m-2 h-[70px] rounded-lg px-4",
                          "text-left text-lg text-talearnt-Text_04",
                          "hover:bg-talearnt-BG_Up_01 hover:font-medium hover:text-talearnt-Text_02"
                        )}
                        onClick={() => {
                          handleTalentChange(true, {
                            label: talentName,
                            value: talentCode
                          });
                          setValue("search", "");
                        }}
                        key={talentCode}
                      >
                        {talentName}
                      </button>
                    ))
                  ) : (
                    // 검색한 결과가 없는 경우
                    <></>
                  )}
                </div>
              </div>
              {talentsData[currentTalentsType].length > 0 && (
                <div
                  className={classNames("flex flex-wrap gap-2", "px-[30px]")}
                >
                  {talentsData[currentTalentsType].map(({ label, value }) => (
                    <div
                      className={classNames(
                        "flex items-center gap-1",
                        "h-[30px] rounded-[6px] bg-talearnt-BG_Up_02 px-2"
                      )}
                      key={value}
                    >
                      <span className={"text-base font-medium"}>{label}</span>
                      <CloseIcon
                        onClick={() =>
                          handleTalentChange(false, { label, value })
                        }
                        size={16}
                      />
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </ModalBody>
        <ModalBottom>
          <div
            className={classNames("flex justify-between", "w-full px-[30px]")}
          >
            {isSuccess ? (
              <Button className={"w-full"}>매칭 게시물 보러 가기</Button>
            ) : (
              <>
                {currentTalentsType === "giveTalents" && (
                  <Button
                    className={"ml-auto w-[95px]"}
                    disabled={talentsData.giveTalents.length === 0}
                    onClick={() => handleTypeChange("receiveTalents")}
                  >
                    다음
                  </Button>
                )}
                {currentTalentsType === "receiveTalents" && (
                  <>
                    <Button
                      buttonStyle={"outlined"}
                      className={"w-[95px]"}
                      onClick={() => handleTypeChange("giveTalents")}
                    >
                      이전
                    </Button>
                    <Button
                      className={"w-[95px]"}
                      disabled={talentsData.receiveTalents.length === 0}
                      onClick={handleConfirm}
                    >
                      {isLoading ? <Spinner /> : "완료"}
                    </Button>
                  </>
                )}
              </>
            )}
          </div>
        </ModalBottom>
      </ModalBox>
    </ModalContainer>
  );
}

export { TalentsSettingModal };
