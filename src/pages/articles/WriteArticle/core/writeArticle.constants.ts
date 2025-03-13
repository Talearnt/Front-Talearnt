import { array, mixed, number, object, string } from "yup";

import {
  durationList,
  exchangeTypeList,
  postTypeList
} from "@pages/articles/core/articles.constants";

export const matchingArticleSchema = object({
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
  pureText: string()
    .required("내용을 입력해 주세요")
    .test(
      "min-length",
      "내용을 20글자 이상 입력해 주세요",
      value => value.length >= 21
    ),
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
    .required()
}).required();
export const communityArticleSchema = object({
  postType: string().oneOf(postTypeList).required(),
  title: string()
    .required("제목을 입력해 주세요")
    .min(2, "제목을 2글자 이상 입력해 주세요"),
  content: string().required(),
  pureText: string()
    .required("내용을 입력해 주세요")
    .test(
      "min-length",
      "내용을 20글자 이상 입력해 주세요",
      value => value.length >= 21
    ),
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
    .required()
}).required();
