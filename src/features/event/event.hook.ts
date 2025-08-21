import { getEventList } from "@features/event/event.api";

import { createQueryKey } from "@shared/utils/createQueryKey";

import { useQueryWithInitial } from "@shared/hooks/useQueryWithInitial";

import { useEventPageStore } from "@features/event/event.store";

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
      queryKey: createQueryKey([queryKeys.EVENT, page], { isList: true }),
      queryFn: () => getEventList({ page, size }),
      enabled,
    },
    createQueryKey([queryKeys.EVENT], { isList: true })
  );
};
