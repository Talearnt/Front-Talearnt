import {
  createQueryKey,
  QueryKeyEnum,
} from "@shared/cache/queryKeys/queryKeyFactory";

/**
 * 게시물 관련 쿼리키
 */
export const ArticleQueryKeys = {
  /**
   * 매칭 게시물
   */
  matching: {
    all: () => createQueryKey([QueryKeyEnum.MATCHING]),
    lists: () => createQueryKey([QueryKeyEnum.MATCHING], { isList: true }),
    list: (filter: Record<string, unknown>) =>
      createQueryKey([QueryKeyEnum.MATCHING, filter], { isList: true }),
    detail: (exchangePostNo: number) =>
      createQueryKey([QueryKeyEnum.MATCHING, exchangePostNo]),
  },

  /**
   * 커뮤니티 게시물
   */
  community: {
    all: () => createQueryKey([QueryKeyEnum.COMMUNITY]),
    lists: () => createQueryKey([QueryKeyEnum.COMMUNITY], { isList: true }),
    list: (filter: Record<string, unknown>) =>
      createQueryKey([QueryKeyEnum.COMMUNITY, filter], { isList: true }),
    detail: (communityPostNo: number) =>
      createQueryKey([QueryKeyEnum.COMMUNITY, communityPostNo]),
  },

  /**
   * 댓글
   */
  comment: {
    all: () => createQueryKey([QueryKeyEnum.COMMENT]),
    lists: (postNo: number) =>
      createQueryKey([QueryKeyEnum.COMMENT, postNo], { isList: true }),
    list: (postNo: number, page: number) =>
      createQueryKey([QueryKeyEnum.COMMENT, postNo, page], { isList: true }),
  },

  /**
   * 답글
   */
  reply: {
    all: () => createQueryKey([QueryKeyEnum.REPLY]),
    lists: (commentNo: number) =>
      createQueryKey([QueryKeyEnum.REPLY, commentNo], { isList: true }),
  },
} as const;
