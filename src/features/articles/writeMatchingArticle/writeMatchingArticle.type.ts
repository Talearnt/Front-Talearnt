import { matchingArticleDetailType } from "@features/articles/matchingArticleDetail/matchingArticleDetail.type";
import {
  commonArticleDataType,
  durationType,
  exchangeType
} from "@features/articles/shared/articles.type";
import { imageFileType } from "@features/articles/shared/writeArticle.type";

// 매칭 게시글 - body
export type matchingArticleBodyType = Pick<
  commonArticleDataType,
  "title" | "content"
> & {
  imageUrls: string[];
  giveTalents: number[];
  receiveTalents: number[];
  duration: durationType;
  exchangeType: exchangeType;
};
// {
//   "title": "",
//   "content": "",
//   "imageUrls": [],
//   "giveTalents": [],
//   "receiveTalents": [],
//   "duration": "기간 미정",
//   "exchangeType": "온라인"
// }

// 매칭 게시글 - state
export type matchingArticleFormDataType = Omit<
  matchingArticleBodyType,
  "imageUrls"
> & {
  pureText: string;
  imageFileList: imageFileType[];
};
// {
//   "title": "",
//   "content": "",
//   "pureText": "",
//   "imageFileList": [],
//   "giveTalents": [],
//   "receiveTalents": [],
//   "duration": "기간 미정",
//   "exchangeType": "온라인"
// }

// 수정 매칭 게시글 - body
export type editMatchingArticleBodyType = matchingArticleBodyType &
  Pick<matchingArticleDetailType, "exchangePostNo">;
// {
//   "exchangePostNo": 0,
//   "title": "",
//   "content": "",
//   "imageUrls": [],
//   "giveTalents": [],
//   "receiveTalents": [],
//   "duration": "기간 미정",
//   "exchangeType": "온라인"
// }
