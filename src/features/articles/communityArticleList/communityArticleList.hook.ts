import { useShallow } from "zustand/shallow";

import { getCommunityArticleList } from "@features/articles/communityArticleList/communityArticleList.api";

import { createQueryKey } from "@shared/utils/createQueryKey";

import { useQueryWithInitial } from "@shared/hooks/useQueryWithInitial";

import { useCommunityArticleListFilterStore } from "@features/articles/communityArticleList/communityArticleList.store";

import { queryKeys } from "@shared/constants/queryKeys";

export const useGetCommunityArticleList = () => {
  // 현재 화면의 필터 상태(쿼리 키의 일부가 됩니다)
  const filter = useCommunityArticleListFilterStore(
    useShallow(state => ({
      postType: state.postType,
      page: state.page,
    }))
  );

  // 리스트 조회
  // - per-query staleTime/gcTime으로 최신성/메모리 사용을 균형 있게
  // - 초기 데이터로 첫 렌더 깜빡임 최소화
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
      queryKey: createQueryKey([queryKeys.COMMUNITY, filter], {
        isList: true,
      }),
      queryFn: async () => await getCommunityArticleList(filter),
      staleTime: 30 * 1000, // 30 seconds
      gcTime: 5 * 60 * 1000, // 5 minutes
    },
    createQueryKey([queryKeys.COMMUNITY], {
      isList: true,
    })
  );
};
