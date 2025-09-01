import {
  createQueryKey,
  QueryKeyEnum,
} from "@shared/cache/queryKeys/queryKeyFactory";

/**
 * 메인페이지 관련 쿼리키
 */
export const MainQueryKeys = {
  /**
   * 메인페이지 추천
   */
  matchingPersonalized: () =>
    createQueryKey([QueryKeyEnum.MAIN, QueryKeyEnum.MATCHING, "personalized"], {
      isLoggedIn: true,
      isList: true,
    }),

  matchingRecent: () =>
    createQueryKey([QueryKeyEnum.MAIN, QueryKeyEnum.MATCHING, "recent"], {
      isList: true,
    }),

  communityBest: () =>
    createQueryKey([QueryKeyEnum.MAIN, QueryKeyEnum.COMMUNITY, "best"], {
      isList: true,
    }),
} as const;
