import { CATEGORIZED_TALENTS_LIST } from "@shared/constants/talentsList.constants";

import {
  durationType,
  exchangeType,
  postType
} from "@features/articles/shared/articles.type";

export const exchangeTypeList: exchangeType[] = [
  "온라인",
  "오프라인",
  "온/오프라인"
];
export const postTypeList: postType[] = [
  "자유 게시판",
  "질문 게시판",
  "스터디 모집 게시판"
];
export const durationList: durationType[] = [
  "기간 미정",
  "1개월",
  "2개월",
  "3개월",
  "3개월 이상"
];
export const durationOptions = durationList.map(item => ({
  label: item,
  value: item
}));
export const talentsOptions = CATEGORIZED_TALENTS_LIST.map(
  ({ categoryName, talents }) => ({
    label: categoryName,
    value: talents.map(({ talentCode, talentName }) => ({
      label: talentName,
      value: talentCode
    }))
  })
);
