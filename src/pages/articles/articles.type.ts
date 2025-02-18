// 게시글 데이터
type commonArticleDataType = {
  title: string;
  content: string;
};

// 매칭 게시글 - 진행 기간
type durationType = "기간 미정" | "1개월" | "2개월" | "3개월" | "3개월 이상";
// 매칭 게시글 - 진행 방식
type exchangeType = "온라인" | "오프라인" | "온_오프라인";
// 매칭 게시글 - body
type matchArticleBodyType = commonArticleDataType & {
  duration: durationType;
  exchangeType: exchangeType;
  giveTalents: number[];
  receiveTalents: number[];
  imageUrls: string[];
};

// 커뮤니티 게시글 - 게시판 타입
type postType = "자유 게시판" | "질문 게시판" | "스터디 모집";
// 커뮤니티 게시글 - body
type communityArticleBodyType = commonArticleDataType & {
  postType: postType;
  imageUrls: string[];
};

export type {
  commonArticleDataType,
  communityArticleBodyType,
  durationType,
  exchangeType,
  matchArticleBodyType,
  postType
};
