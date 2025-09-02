import { useShallow } from "zustand/shallow";

import { getMatchingArticleList } from "@features/articles/matchingArticleList/matchingArticleList.api";

import { CACHE_POLICIES } from "@shared/cache/policies/cachePolicies";
import { QueryKeyFactory } from "@shared/cache/queryKeys/queryKeyFactory";

import { useQueryWithInitial } from "@shared/hooks/useQueryWithInitial";

import { useMatchingArticleListFilterStore } from "@features/articles/matchingArticleList/matchingArticleList.store";

/**
 * useGetMatchingArticleList
 * - 필터 상태를 쿼리 키로 사용해 매칭 게시물 리스트를 조회합니다.
 */
export const useGetMatchingArticleList = () => {
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
      ...CACHE_POLICIES.ARTICLE_LIST,
    },
    QueryKeyFactory.matching.lists()
  );
};
