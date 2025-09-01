import { ARTICLE_CACHE_POLICIES } from "@shared/cache/policies/article.policies";
import { AUTH_CACHE_POLICIES } from "@shared/cache/policies/auth.policies";
import { MAIN_CACHE_POLICIES } from "@shared/cache/policies/main.policies";
import { USER_CACHE_POLICIES } from "@shared/cache/policies/user.policies";

/* 통합된 캐시 정책 객체
 * - per-query 캐시 정책으로 최신성/메모리 사용 균형
 */
export const CACHE_POLICIES = {
  // 게시물 관련
  ...ARTICLE_CACHE_POLICIES,

  // 사용자 관련
  ...USER_CACHE_POLICIES,

  // 인증 관련
  ...AUTH_CACHE_POLICIES,

  // 메인페이지 관련
  ...MAIN_CACHE_POLICIES,
} as const;
