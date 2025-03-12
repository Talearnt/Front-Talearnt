// 게시글 데이터
export type commonArticleDataType = {
  title: string;
  content: string;
  createdAt: string;
};

// 매칭 게시글 - 진행 기간
export type durationType =
  | "기간 미정"
  | "1개월"
  | "2개월"
  | "3개월"
  | "3개월 이상";
// 매칭 게시글 - 진행 방식
export type exchangeType = "온라인" | "오프라인" | "온/오프라인";

// 커뮤니티 게시글 - 게시판 타입
export type postType = "자유 게시판" | "질문 게시판" | "스터디 모집 게시판";
