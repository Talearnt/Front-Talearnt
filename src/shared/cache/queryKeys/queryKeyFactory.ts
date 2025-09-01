import { ArticleQueryKeys } from "@shared/cache/queryKeys/article.keys";
import { AuthQueryKeys } from "@shared/cache/queryKeys/auth.keys";
import { EtcQueryKeys } from "@shared/cache/queryKeys/etc.keys";
import { MainQueryKeys } from "@shared/cache/queryKeys/main.keys";
import { UserQueryKeys } from "@shared/cache/queryKeys/user.keys";

/**
 * 쿼리키 enum
 */
export enum QueryKeyEnum {
  USER = "USER",
  MAIN = "MAIN",
  NOTICE = "NOTICE",
  EVENT = "EVENT",
  MATCHING = "MATCHING",
  COMMUNITY = "COMMUNITY",
  COMMENT = "COMMENT",
  REPLY = "REPLY",
  AUTH = "AUTH",
}

/**
 * 쿼리키 생성
 */
export const createQueryKey = (
  key: unknown[],
  { isLoggedIn, isList }: { isLoggedIn?: boolean; isList?: boolean } = {}
) => [
  ...(isLoggedIn ? ["AFTER_LOGIN"] : []),
  ...(isList ? ["LIST"] : []),
  ...key,
];

// 통합된 쿼리키 팩토리
export const QueryKeyFactory = {
  // 게시물 관련
  ...ArticleQueryKeys,

  // 사용자 관련
  user: UserQueryKeys,

  // 인증 관련
  auth: AuthQueryKeys,

  // 메인페이지 관련
  main: MainQueryKeys,

  // Etc 관련
  ...EtcQueryKeys,
} as const;
