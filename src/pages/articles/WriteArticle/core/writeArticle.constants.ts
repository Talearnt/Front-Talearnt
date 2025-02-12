import { CATEGORIZED_TALENTS_LIST } from "@common/common.constants";

import {
  boardType,
  durationType,
  exchangeType
} from "@pages/articles/WriteArticle/core/writeArticle.type";

const boardTypeList: boardType[] = [
  "자유 게시판",
  "질문 게시판",
  "스터디 모집"
];
const durationList: durationType[] = [
  "기간 미정",
  "1개월",
  "2개월",
  "3개월",
  "3개월 이상"
];
const exchangeTypeList: exchangeType[] = ["온라인", "오프라인", "온오프라인"];

const durationOptions = durationList.map(item => ({
  label: item,
  value: item
}));
const receiveTalentsOptions = CATEGORIZED_TALENTS_LIST.map(
  ({ categoryName, talents }) => ({
    label: categoryName,
    value: talents.map(({ talentCode, talentName }) => ({
      label: talentName,
      value: talentCode
    }))
  })
);

export {
  boardTypeList,
  durationList,
  durationOptions,
  exchangeTypeList,
  receiveTalentsOptions
};
