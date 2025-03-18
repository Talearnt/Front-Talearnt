import {
  commonArticleDataType,
  durationType,
  exchangeType
} from "@pages/articles/core/articles.type";
import { matchingArticleDetailType } from "@pages/articles/MatchingArticleDetail/core/matchingArticleDetail.type";
import { imageFileType } from "@pages/articles/WriteArticle/core/writeArticle.type";

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
  imageFileList: imageFileType[];
  pureText: string;
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
