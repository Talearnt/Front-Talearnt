// 게시글 데이터
import { profileType } from "@type/user.type";

export type baseContentType = {
  content: string;
  createdAt: string;
  updatedAt: string;
};
export type commonArticleDataType = baseContentType & {
  title: string;
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
// 댓글
export type commentType = Pick<
  profileType,
  "userNo" | "nickname" | "profileImg"
> &
  baseContentType & {
    commentNo: number;
    replyCount: number;
  };
// {
//   "content": "",
//   "commentNo": 0,
//   "createdAt": "",
//   "nickname": "",
//   "profileImg": null,
//   "replyCount": 0,
//   "updatedAt": "",
//   "userNo": 0
// }

// 답글
export type replyType = Pick<
  profileType,
  "userNo" | "nickname" | "profileImg"
> &
  baseContentType & {
    replyNo: number;
  };
// {
//   "content": "",
//   "createdAt": "",
//   "nickname": "",
//   "profileImg": null,
//   "replyNo": 0,
//   "updatedAt": "",
//   "userNo": 0
// }
