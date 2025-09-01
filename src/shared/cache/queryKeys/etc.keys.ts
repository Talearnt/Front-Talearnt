import {
  createQueryKey,
  QueryKeyEnum,
} from "@shared/cache/queryKeys/queryKeyFactory";

/**
 * Etc 관련 쿼리키
 */
export const EtcQueryKeys = {
  /**
   * 이벤트/공지사항
   */
  event: {
    all: () => createQueryKey([QueryKeyEnum.EVENT]),
    lists: () => createQueryKey([QueryKeyEnum.EVENT], { isList: true }),
    list: (filter: Record<string, unknown>) =>
      createQueryKey([QueryKeyEnum.EVENT, filter], {
        isList: true,
      }),
    detail: (id: number) => createQueryKey([QueryKeyEnum.EVENT, id]),
  },

  notice: {
    all: () => createQueryKey([QueryKeyEnum.NOTICE]),
    lists: () => createQueryKey([QueryKeyEnum.NOTICE], { isList: true }),
    list: (filter: Record<string, unknown>) =>
      createQueryKey([QueryKeyEnum.NOTICE, filter], {
        isList: true,
      }),
    detail: (id: number) => createQueryKey([QueryKeyEnum.NOTICE, id]),
  },
} as const;
