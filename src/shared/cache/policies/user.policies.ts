/**
 * 사용자 관련 캐시 정책
 */
export const USER_CACHE_POLICIES = {
  // 사용자 프로필 - 변경 빈도 낮음
  USER_PROFILE: {
    staleTime: 10 * 60 * 1000, // 10분
    gcTime: 30 * 60 * 1000, // 30분
  },

  // 작성글 목록 - 변경 빈도 중간
  WRITTEN_LIST: {
    staleTime: 3 * 60 * 1000, // 3분
    gcTime: 15 * 60 * 1000, // 15분
  },

  // 즐겨찾기 목록 - 변경 빈도 중간
  FAVORITE_LIST: {
    staleTime: 5 * 60 * 1000, // 5분
    gcTime: 15 * 60 * 1000, // 15분
  },
} as const;
