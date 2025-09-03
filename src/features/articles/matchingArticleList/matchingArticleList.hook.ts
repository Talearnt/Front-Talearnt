import { useShallow } from "zustand/shallow";

import { getMatchingArticleList } from "@features/articles/matchingArticleList/matchingArticleList.api";

import { CACHE_POLICIES, QueryKeyFactory } from "@shared/utils/cacheManager";

import { useQueryWithInitial } from "@shared/hooks/useQueryWithInitial";

import { useMatchingArticleListFilterStore } from "@features/articles/matchingArticleList/matchingArticleList.store";

export const useGetMatchingArticleList = () => {
  // 현재 화면의 필터 상태(쿼리 키의 일부가 됩니다)
  const filter = useMatchingArticleListFilterStore(
    useShallow(state => ({
      giveTalents: state.giveTalents,
      receiveTalents: state.receiveTalents,
      duration: state.duration,
      type: state.type,
      status: state.status,
      order: state.order,
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
      queryKey: QueryKeyFactory.matching.list(filter),
      queryFn: async () => await getMatchingArticleList(filter),
      staleTime: CACHE_POLICIES.ARTICLE_LIST.staleTime,
      gcTime: CACHE_POLICIES.ARTICLE_LIST.gcTime,
    },
    QueryKeyFactory.matching.lists()
  );
};
