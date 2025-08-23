import {
  getEventList,
  getNoticeList,
} from "@features/eventNotice/eventNotice.api";

import { createQueryKey } from "@shared/utils/createQueryKey";

import { useQueryWithInitial } from "@shared/hooks/useQueryWithInitial";

import {
  useEventPageStore,
  useNoticePageStore,
} from "@features/eventNotice/eventNotice.store";

import { queryKeys } from "@shared/constants/queryKeys";

type useGetEventListProps = {
  enabled?: boolean;
  size?: number;
};

export const useGetEventList = ({
  enabled = true,
  size,
}: useGetEventListProps) => {
  const page = useEventPageStore(state => state.page);

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
      queryKey: createQueryKey([queryKeys.EVENT, size, page], { isList: true }),
      queryFn: () => getEventList({ page, size }),
      enabled,
    },
    createQueryKey([queryKeys.EVENT], { isList: true })
  );
};

type useGetNoticeListProps = {
  enabled?: boolean;
  size?: number;
};

export const useGetNoticeList = ({
  enabled = true,
  size,
}: useGetNoticeListProps) => {
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
      queryKey: createQueryKey([queryKeys.NOTICE, size, page], {
        isList: true,
      }),
      queryFn: () => getNoticeList({ page, size }),
      enabled,
    },
    createQueryKey([queryKeys.NOTICE], { isList: true })
  );
};
