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
  duration: durationType;
  exchangeType: exchangeType;
  giveTalents: number[];
  receiveTalents: number[];
  imageUrls: string[];
};
// 매칭 게시글 - state
export type matchingArticleFormDataType = Omit<
  matchingArticleBodyType,
  "imageUrls"
> & {
  pureText: string;
  imageFileList: imageFileType[];
};
// 수정 매칭 게시글 - body
export type editMatchingArticleBodyType = matchingArticleBodyType &
  Pick<matchingArticleDetailType, "exchangePostNo">;
