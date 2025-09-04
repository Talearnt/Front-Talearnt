/**
 * 메인페이지 관련 캐시 정책
 */
export const MAIN_CACHE_POLICIES = {
  // 메인 페이지 - 변동성에 따라 차등
  MAIN_PERSONALIZED: {
    staleTime: 3 * 60 * 1000, // 3분 - 개인화된 추천
    gcTime: 15 * 60 * 1000, // 15분
  },

  MAIN_RECENT: {
    staleTime: 2 * 60 * 1000, // 2분 - 최신 글
    gcTime: 10 * 60 * 1000, // 10분
  },

  MAIN_BEST: {
    staleTime: 5 * 60 * 1000, // 5분 - 인기 글
    gcTime: 15 * 60 * 1000, // 15분
  },

  // 이벤트/공지사항 - 변경 빈도 매우 낮음
  EVENT_NOTICE: {
    staleTime: 30 * 60 * 1000, // 30분
    gcTime: 2 * 60 * 60 * 1000, // 2시간
  },
} as const;
