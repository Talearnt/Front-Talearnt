import {
  createQueryKey,
  QueryKeyEnum,
} from "@shared/cache/queryKeys/queryKeyFactory";

/**
 * 사용자 관련 쿼리키
 */
export const UserQueryKeys = {
  /**
   * 사용자 프로필
   */
  all: () => createQueryKey([QueryKeyEnum.USER]),
  profile: () =>
    createQueryKey([QueryKeyEnum.USER, "profile"], { isLoggedIn: true }),
  activityCounts: () =>
    createQueryKey(
      [
        QueryKeyEnum.USER,
        QueryKeyEnum.COMMUNITY,
        QueryKeyEnum.MATCHING,
        QueryKeyEnum.COMMENT,
        "activityCounts",
      ],
      { isLoggedIn: true }
    ),

  /**
   * 사용자 작성글
   */
  written: {
    all: () => createQueryKey([QueryKeyEnum.USER, "written"]),
    community: {
      all: () =>
        createQueryKey([QueryKeyEnum.USER, QueryKeyEnum.COMMUNITY, "written"], {
          isList: true,
          isLoggedIn: true,
        }),
      list: (page: number) =>
        createQueryKey(
          [QueryKeyEnum.USER, QueryKeyEnum.COMMUNITY, "written", page],
          {
            isList: true,
            isLoggedIn: true,
          }
        ),
    },
    matching: {
      all: () =>
        createQueryKey([QueryKeyEnum.USER, QueryKeyEnum.MATCHING, "written"], {
          isList: true,
          isLoggedIn: true,
        }),
      list: (page: number) =>
        createQueryKey(
          [QueryKeyEnum.USER, QueryKeyEnum.MATCHING, "written", page],
          {
            isList: true,
            isLoggedIn: true,
          }
        ),
    },
    comment: {
      all: () =>
        createQueryKey([QueryKeyEnum.USER, QueryKeyEnum.COMMENT, "written"], {
          isList: true,
          isLoggedIn: true,
        }),
      list: (page: number) =>
        createQueryKey(
          [QueryKeyEnum.USER, QueryKeyEnum.COMMENT, "written", page],
          {
            isList: true,
            isLoggedIn: true,
          }
        ),
    },
    reply: {
      all: () =>
        createQueryKey([QueryKeyEnum.USER, QueryKeyEnum.REPLY, "written"], {
          isList: true,
          isLoggedIn: true,
        }),
      list: (page: number) =>
        createQueryKey(
          [QueryKeyEnum.USER, QueryKeyEnum.REPLY, "written", page],
          {
            isList: true,
            isLoggedIn: true,
          }
        ),
    },
  },

  /**
   * 즐겨찾기
   */
  favoriteMatching: {
    all: () =>
      createQueryKey([QueryKeyEnum.USER, QueryKeyEnum.MATCHING, "favorite"], {
        isList: true,
        isLoggedIn: true,
      }),
    list: (page: number) =>
      createQueryKey(
        [QueryKeyEnum.USER, QueryKeyEnum.MATCHING, "favorite", page],
        {
          isList: true,
          isLoggedIn: true,
        }
      ),
  },
} as const;
