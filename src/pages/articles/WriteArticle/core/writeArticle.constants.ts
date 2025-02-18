import { array, mixed, number, object, string } from "yup";

import { CATEGORIZED_TALENTS_LIST } from "@common/common.constants";

import {
  durationType,
  exchangeType,
  postType
} from "@pages/articles/articles.type";

const articleTypeOptions = [
  { label: "매칭 게시물 글쓰기", value: "match" },
  { label: "커뮤니티 게시물 글쓰기", value: "community" }
];
const durationList: durationType[] = [
  "기간 미정",
  "1개월",
  "2개월",
  "3개월",
  "3개월 이상"
];
const exchangeTypeList: exchangeType[] = ["온라인", "오프라인", "온/오프라인"];
const postTypeList: postType[] = ["자유 게시판", "질문 게시판", "스터디 모집"];

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

const matchArticleSchema = object({
  giveTalents: array()
    .of(number().required())
    .min(1, "재능 키워드를 선택해 주세요")
    .required(),
  receiveTalents: array()
    .of(number().required())
    .min(1, "재능 키워드를 선택해 주세요")
    .required(),
  duration: string().oneOf(durationList).required("진행 기간을 선택해 주세요"),
  exchangeType: string().oneOf(exchangeTypeList).required(),
  title: string()
    .required("제목을 입력해 주세요")
    .min(2, "제목을 2글자 이상 입력해 주세요"),
  content: string().required(),
  imageFileList: array()
    .of(
      object({
        file: mixed().required(),
        fileName: string().required(),
        fileType: string().required(),
        fileSize: number().required(),
        url: string().required()
      }).required()
    )
    .required(),
  pureText: string()
    .required("내용을 입력해 주세요")
    .test(
      "min-length",
      "내용을 20글자 이상 입력해 주세요",
      value => value.length >= 21
    )
}).required();
const communityArticleSchema = object({
  postType: string().oneOf(postTypeList).required(),
  title: string()
    .required("제목을 입력해 주세요")
    .min(2, "제목을 2글자 이상 입력해 주세요"),
  content: string().required(),
  imageFileList: array()
    .of(
      object({
        file: mixed().required(),
        fileName: string().required(),
        fileType: string().required(),
        fileSize: number().required(),
        url: string().required()
      }).required()
    )
    .required(),
  pureText: string()
    .required("내용을 입력해 주세요")
    .test(
      "min-length",
      "내용을 20글자 이상 입력해 주세요",
      value => value.length >= 21
    )
}).required();

export {
  articleTypeOptions,
  communityArticleSchema,
  durationList,
  durationOptions,
  exchangeTypeList,
  matchArticleSchema,
  postTypeList,
  receiveTalentsOptions
};
