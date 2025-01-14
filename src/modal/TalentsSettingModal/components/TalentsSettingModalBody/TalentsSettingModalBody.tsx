import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";

import { yupResolver } from "@hookform/resolvers/yup";
import { object, string } from "yup";

import { classNames } from "@utils/classNames";

import useDebounce from "@hook/useDebounce";

import { useToastStore } from "@common/common.store";
import { useTalentsSettingModalStore } from "@modal/TalentsSettingModal/core/talentsSettingModal.store";

import { CircleCheckIcon } from "@components/icons/CircleCheckIcon/CircleCheckIcon";
import { CloseIcon } from "@components/icons/CloseIcon/CloseIcon";
import { MakoExpressionSad } from "@components/icons/Mako/MakoExpressionSad";
import { SearchIcon } from "@components/icons/SearchIcon/SearchIcon";
import { Input } from "@components/Input/Input";
import { ModalBody } from "@components/modal/ModalBody/ModalBody";
import { MultiSelectDropdown } from "@components/MultiSelectDropdown/MultiSelectDropdown";

import {
  CATEGORIZED_TALENTS_LIST,
  CURRENT_TALENTS_TYPE_NAME
} from "@modal/TalentsSettingModal/core/talentsList.constants";

import { talentsType } from "@modal/TalentsSettingModal/core/talentsSettingModal.type";

import styles from "./TalentsSettingModalBody.module.css";

const talentsSearchSchema = object({
  search: string()
}).required();

function TalentsSettingModalBody() {
  const { setValue, register, watch } = useForm({
    mode: "onChange",
    resolver: yupResolver(talentsSearchSchema)
  });

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
  }, [scrollRef, search]);

  return (
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
                  {CURRENT_TALENTS_TYPE_NAME[key as talentsType]} 키워드
                </h3>
                <div className={"flex flex-wrap gap-2"}>
                  {talentsData[key as talentsType].map(({ label, value }) => (
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
            <div
              className={classNames(
                "flex flex-col",
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
                        if (
                          talentsData[currentTalentsType].length > 4 &&
                          checked
                        ) {
                          setToast({
                            message: "재능 키워드는 5개까지만 선택 가능해요",
                            type: "error"
                          });

                          return;
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
                searchedTalentsList.map(({ talentCode, talentName }) => (
                  <button
                    className={classNames(
                      "flex-shrink-0",
                      "m-2 h-[70px] rounded-lg px-4",
                      "text-left text-lg text-talearnt-Text_04",
                      "hover:bg-talearnt-BG_Up_01 hover:font-medium hover:text-talearnt-Text_02"
                    )}
                    onClick={() => {
                      if (talentsData[currentTalentsType].length > 4) {
                        setToast({
                          message: "재능 키워드는 5개까지만 선택 가능해요",
                          type: "error"
                        });

                        return;
                      }

                      setTalentsData({
                        type: "add",
                        talent: {
                          label: talentName,
                          value: talentCode
                        }
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
                <>
                  <span
                    className={"text-xl font-semibold text-talearnt-Text_03"}
                  >
                    이 키워드는 없어요...
                  </span>
                  <MakoExpressionSad />
                </>
              )}
            </div>
          </div>
          {talentsData[currentTalentsType].length > 0 && (
            <div className={classNames("flex flex-wrap gap-2", "px-[30px]")}>
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
                      setTalentsData({
                        type: "remove",
                        talent: { label, value }
                      })
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
  );
}

export { TalentsSettingModalBody };
