import { dropdownOptionType } from "@components/common/dropdowns/dropdown.type";
import {
  durationType,
  exchangeType,
  postType,
} from "@features/articles/shared/articles.type";

export const exchangeTypeList: exchangeType[] = [
  "온라인",
  "오프라인",
  "온/오프라인",
];
export const postTypeList: postType[] = [
  "자유 게시판",
  "질문 게시판",
  "스터디 모집 게시판",
];
export const durationList: durationType[] = [
  "기간 미정",
  "1개월",
  "2개월",
  "3개월",
  "3개월 이상",
];
export const durationOptions: dropdownOptionType<durationType>[] = [
  {
    label: "기간 미정",
    value: "기간 미정",
  },
  {
    label: "1개월",
    value: "1개월",
  },
  {
    label: "2개월",
    value: "2개월",
  },
  {
    label: "3개월",
    value: "3개월",
  },
  {
    label: "3개월 이상",
    value: "3개월 이상",
  },
];
