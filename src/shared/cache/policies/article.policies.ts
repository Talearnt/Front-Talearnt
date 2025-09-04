/**
 * 게시물 관련 캐시 정책
 */
export const ARTICLE_CACHE_POLICIES = {
  // 게시물 목록 - 자주 변하므로 짧은 staleTime
  ARTICLE_LIST: {
    staleTime: 30 * 1000, // 30초
    gcTime: 5 * 60 * 1000, // 5분
  },

  // 게시물 상세 - 댓글/좋아요 등이 자주 변하므로 짧은 staleTime
  ARTICLE_DETAIL: {
    staleTime: 1 * 60 * 1000, // 1분
    gcTime: 10 * 60 * 1000, // 10분
  },

  // 댓글 목록 - 실시간성 중요
  COMMENT_LIST: {
    staleTime: 30 * 1000, // 30초
    gcTime: 5 * 60 * 1000, // 5분
  },

  // 답글 목록 - 가장 실시간성 중요한 대화형 컨텐츠
  REPLY_LIST: {
    staleTime: 20 * 1000, // 20초
    gcTime: 3 * 60 * 1000, // 3분
  },
} as const;
