import { getNoticeList } from "@features/notice/notice.api";

import { createQueryKey } from "@shared/utils/createQueryKey";

import { useQueryWithInitial } from "@shared/hooks/useQueryWithInitial";

import { useNoticePageStore } from "@features/notice/notice.store";

import { queryKeys } from "@shared/constants/queryKeys";

export const useGetNoticeList = (size?: number) => {
  const page = useNoticePageStore(state => state.page);

  return useQueryWithInitial(
    {
      results: [],
      pagination: {
        hasNext: false,
        hasPrevious: false,
        totalPages: 1,
        currentPage: 1,
        totalCount: 0,
        latestCreatedAt: "",
      },
    },
    {
      queryKey: createQueryKey([queryKeys.NOTICE, page], { isList: true }),
      queryFn: () => getNoticeList({ page, size }),
    },
    createQueryKey([queryKeys.NOTICE], { isList: true })
  );
};
