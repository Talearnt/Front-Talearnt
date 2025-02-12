import { Dispatch, SetStateAction, useMemo } from "react";

import { useGetProfile } from "@hook/user.hook";

import { Chip } from "@components/Chip/Chip";
import { SearchableDropdown } from "@components/dropdowns/SearchableDropdown/SearchableDropdown";
import { PencilIcon } from "@components/icons/textEditor/PencilIcon";
import { TitledBox } from "@components/TitledBox/TitledBox";

import { CATEGORIZED_TALENTS_LIST } from "@common/common.constants";
import {
  boardTypeList,
  durationOptions,
  exchangeTypeList,
  receiveTalentsOptions
} from "@pages/articles/WriteArticle/core/writeArticle.constants";

import { dropdownOptionType } from "@components/dropdowns/dropdown.type";
import {
  articleType,
  communityArticleDataType,
  matchArticleFormDataType
} from "@pages/articles/WriteArticle/core/writeArticle.type";

type writeArticleInfoProps = {
  type: articleType;
  communityArticleData: communityArticleDataType;
  matchArticleData: matchArticleFormDataType;
  setCommunityArticleData: Dispatch<SetStateAction<communityArticleDataType>>;
  setMatchArticleData: Dispatch<SetStateAction<matchArticleFormDataType>>;
};

function WriteArticleInfo({
  type,
  communityArticleData: { boardType },
  matchArticleData: { duration, exchangeType, giveTalents, receiveTalents },
  setCommunityArticleData,
  setMatchArticleData
}: writeArticleInfoProps) {
  const {
    data: {
      data: { giveTalents: giveTalentCodeList }
    }
  } = useGetProfile(type === "match");

  const giveTalentsOptions = useMemo(() => {
    if (type === "community") {
      return [];
    }

    return CATEGORIZED_TALENTS_LIST.reduce<dropdownOptionType<number>[]>(
      (acc, category) => {
        category.talents.forEach(({ talentCode, talentName }) => {
          if (giveTalentCodeList.includes(talentCode)) {
            acc.push({ label: talentName, value: talentCode });
          }
        });

        return acc;
      },
      []
    );
  }, [giveTalentCodeList, type]);

  return (
    <TitledBox
      className={"mb-6"}
      title={
        <div className={"flex items-center gap-4"}>
          <PencilIcon />
          <span
            className={"text-talearnt-Text_Strong text-heading4_20_semibold"}
          >
            필수 정보를 입력해 주세요
          </span>
        </div>
      }
    >
      {type === "match" && (
        <div className={"grid grid-cols-2 grid-rows-2 gap-6"}>
          <div className={"flex flex-col gap-2"}>
            <span className={"text-body2_16_medium"}>주고 싶은 재능</span>
            <SearchableDropdown
              options={giveTalentsOptions}
              onSelectHandler={({ checked, label, value }) =>
                setMatchArticleData(prev => {
                  if (checked) {
                    const talent = { label, value };

                    return {
                      ...prev,
                      giveTalents: [...prev.giveTalents, talent]
                    };
                  } else {
                    return {
                      ...prev,
                      giveTalents: prev.giveTalents.filter(
                        talent => talent.value !== value
                      )
                    };
                  }
                })
              }
              placeholder={"주고 싶은 재능을 선택해 주세요"}
              selectedOptionsArray={giveTalents}
            />
          </div>
          <div className={"flex flex-col gap-2"}>
            <span className={"text-body2_16_medium"}>받고 싶은 재능</span>
            <SearchableDropdown
              options={receiveTalentsOptions}
              onSelectHandler={({ checked, ...talent }) =>
                setMatchArticleData(prev => {
                  if (checked) {
                    return {
                      ...prev,
                      receiveTalents: [...prev.receiveTalents, talent]
                    };
                  } else {
                    return {
                      ...prev,
                      receiveTalents: prev.receiveTalents.filter(
                        ({ value }) => talent.value !== value
                      )
                    };
                  }
                })
              }
              placeholder={
                "받고 싶은 재능을 선택해 주세요 (최대 5개 선택 가능)"
              }
              selectedOptionsArray={receiveTalents}
            />
          </div>
          <div className={"flex flex-col gap-2"}>
            <span className={"text-body2_16_medium"}>진행 기간</span>
            <SearchableDropdown
              isMultiple={false}
              options={durationOptions}
              onSelectHandler={({ label, value }) =>
                setMatchArticleData(prev => ({
                  ...prev,
                  duration: [{ label, value }]
                }))
              }
              placeholder={"진행 기간을 선택해 주세요."}
              selectedOptionsArray={duration}
            />
          </div>
          <div className={"flex flex-col gap-2"}>
            <span className={"text-body2_16_medium"}>진행 방식</span>
            <div className={"grid grid-cols-3 gap-2"}>
              {exchangeTypeList.map(type => (
                <Chip
                  onClickHandler={() =>
                    setMatchArticleData(prev => ({
                      ...prev,
                      exchangeType: type
                    }))
                  }
                  pressed={exchangeType === type}
                  type={"default-large"}
                  key={type}
                >
                  {type}
                </Chip>
              ))}
            </div>
          </div>
        </div>
      )}
      {type === "community" && (
        <div className={"flex flex-col gap-2"}>
          <span className={"text-body2_16_medium"}>진행 방식</span>
          <div className={"grid grid-cols-[repeat(3,156px)] gap-4"}>
            {boardTypeList.map(board => (
              <Chip
                onClickHandler={() =>
                  setCommunityArticleData(prev => ({
                    ...prev,
                    type: board
                  }))
                }
                pressed={board === boardType}
                type={"default-large"}
                key={board}
              >
                {exchangeType}
              </Chip>
            ))}
          </div>
        </div>
      )}
    </TitledBox>
  );
}

export { WriteArticleInfo };
