import { useMemo } from "react";

import { FieldErrors } from "react-hook-form";

import { useGetProfile } from "@hook/user.hook";

import { Chip } from "@components/Chip/Chip";
import { SearchableDropdown } from "@components/dropdowns/SearchableDropdown/SearchableDropdown";
import { PencilIcon } from "@components/icons/textEditor/PencilIcon";
import { TitledBox } from "@components/TitledBox/TitledBox";

import { CATEGORIZED_TALENTS_LIST } from "@common/common.constants";
import {
  durationOptions,
  exchangeTypeList,
  postTypeList,
  receiveTalentsOptions
} from "@pages/articles/WriteArticle/core/writeArticle.constants";

import { dropdownOptionType } from "@components/dropdowns/dropdown.type";
import {
  articleType,
  communityArticleDataType,
  durationType,
  matchArticleFormDataType
} from "@pages/articles/WriteArticle/core/writeArticle.type";

type writeArticleInfoProps = {
  type: articleType;
  communityArticleData: Omit<communityArticleDataType, "imageFileList">;
  matchArticleData: Omit<matchArticleFormDataType, "imageFileList">;
  handleCommunityDataChange: (
    field: keyof communityArticleDataType,
    value: communityArticleDataType[keyof communityArticleDataType]
  ) => void;
  handleMatchDataChange: (
    field: keyof matchArticleFormDataType,
    value: matchArticleFormDataType[keyof matchArticleFormDataType]
  ) => void;
  errors: FieldErrors<{
    duration: dropdownOptionType<durationType>[];
    giveTalents: dropdownOptionType<number>[];
    receiveTalents: dropdownOptionType<number>[];
  }>;
};

function WriteArticleInfo({
  type,
  communityArticleData: { postType },
  matchArticleData: { duration, exchangeType, giveTalents, receiveTalents },
  handleCommunityDataChange,
  handleMatchDataChange,
  errors
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
              error={errors.giveTalents?.message}
              options={giveTalentsOptions}
              onSelectHandler={({ checked, ...talent }) =>
                checked
                  ? handleMatchDataChange("giveTalents", [
                      ...giveTalents,
                      talent
                    ])
                  : handleMatchDataChange(
                      "giveTalents",
                      giveTalents.filter(({ value }) => talent.value !== value)
                    )
              }
              placeholder={"주고 싶은 재능을 선택해 주세요"}
              selectedOptionsArray={giveTalents}
            />
          </div>
          <div className={"flex flex-col gap-2"}>
            <span className={"text-body2_16_medium"}>받고 싶은 재능</span>
            <SearchableDropdown
              error={errors.receiveTalents?.message}
              options={receiveTalentsOptions}
              onSelectHandler={({ checked, ...talent }) =>
                checked
                  ? handleMatchDataChange("receiveTalents", [
                      ...receiveTalents,
                      talent
                    ])
                  : handleMatchDataChange(
                      "receiveTalents",
                      receiveTalents.filter(
                        ({ value }) => talent.value !== value
                      )
                    )
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
              error={errors.duration?.message}
              options={durationOptions}
              onSelectHandler={({ label, value }) =>
                handleMatchDataChange("duration", [{ label, value }])
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
                    handleMatchDataChange("exchangeType", type)
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
            {postTypeList.map(type => (
              <Chip
                onClickHandler={() =>
                  handleCommunityDataChange("postType", type)
                }
                pressed={postType === type}
                type={"default-large"}
                key={type}
              >
                {type}
              </Chip>
            ))}
          </div>
        </div>
      )}
    </TitledBox>
  );
}

export { WriteArticleInfo };
