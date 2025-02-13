import { dropdownOptionType } from "@components/dropdowns/dropdown.type";

// 게시글 타입
type articleType = "match" | "community";
// 게시글 데이터
type commonArticleDataType = {
  title: string;
  content: string;
  pureText: string;
  imageUrls: string[];
};
// 매칭 게시글 - 진행 기간
type durationType = "기간 미정" | "1개월" | "2개월" | "3개월" | "3개월 이상";
// 매칭 게시글 - 진행 방식
type exchangeType = "온라인" | "오프라인" | "온오프라인";
// 매칭 게시글 - state
type matchArticleFormDataType = commonArticleDataType & {
  duration: dropdownOptionType<durationType>[];
  exchangeType: exchangeType;
  giveTalents: dropdownOptionType<number>[];
  receiveTalents: dropdownOptionType<number>[];
};
// 매칭 게시글 - body
type matchArticleBodyType = Pick<
  matchArticleFormDataType,
  "title" | "content" | "imageUrls" | "exchangeType"
> & {
  duration: durationType;
  giveTalents: number[];
  receiveTalents: number[];
};
// 커뮤니티 게시글 - 게시판 타입
type postType = "자유 게시판" | "질문 게시판" | "스터디 모집";
// 커뮤니티 게시글 - state
type communityArticleDataType = commonArticleDataType & {
  postType: postType;
};

export type {
  articleType,
  communityArticleDataType,
  durationType,
  exchangeType,
  matchArticleBodyType,
  matchArticleFormDataType,
  postType
};
