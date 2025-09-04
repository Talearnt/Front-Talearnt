/**
 * 인증 관련 캐시 정책
 */
export const AUTH_CACHE_POLICIES = {
  // 인증 관련 (중복체크, 닉네임 등)
  AUTH_VALIDATION: {
    staleTime: 5 * 60 * 1000, // 5분 (중복체크 결과는 어느정도 유지)
    gcTime: 10 * 60 * 1000, // 10분
  },
} as const;
