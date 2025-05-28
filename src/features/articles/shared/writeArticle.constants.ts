import { array, mixed, number, object, string } from "yup";

import {
  durationList,
  exchangeTypeList,
  postTypeList
} from "@features/articles/shared/articles.constants";

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
      // 동적으로 메시지를 변경하기 위해 test 내에서 메시지를 반환
      (value, context) => {
        // content에서 <img> 태그가 있는지 검사
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access
        const contentHasImage = context.parent.content.includes("<img");

        // 이미지가 있으면 최소 글자 수를 2로 설정, 아니면 21 (editor에서 내용이 없어도 개행문자로인해 길이가 1부터 시작)
        const minLength = contentHasImage ? 3 : 21;

        // 조건에 맞지 않으면 동적으로 메시지를 설정
        if (value.length < minLength) {
          return context.createError({
            message: contentHasImage
              ? "내용을 2글자 이상 입력해 주세요" // 이미지가 있을 경우
              : "내용을 20글자 이상 입력해 주세요" // 이미지가 없을 경우
          });
        }

        return true;
      }
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
      // 동적으로 메시지를 변경하기 위해 test 내에서 메시지를 반환
      (value, context) => {
        // content에서 <img> 태그가 있는지 검사
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access
        const contentHasImage = context.parent.content.includes("<img");

        // 이미지가 있으면 최소 글자 수를 2로 설정, 아니면 21 (editor에서 내용이 없어도 개행문자로인해 길이가 1부터 시작)
        const minLength = contentHasImage ? 3 : 21;

        // 조건에 맞지 않으면 동적으로 메시지를 설정
        if (value.length < minLength) {
          return context.createError({
            message: contentHasImage
              ? "내용을 2글자 이상 입력해 주세요" // 이미지가 있을 경우
              : "내용을 20글자 이상 입력해 주세요" // 이미지가 없을 경우
          });
        }

        return true;
      }
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
