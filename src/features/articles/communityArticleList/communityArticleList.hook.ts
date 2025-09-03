import { useShallow } from "zustand/shallow";

import { getCommunityArticleList } from "@features/articles/communityArticleList/communityArticleList.api";

import { CACHE_POLICIES } from "@shared/cache/policies/cachePolicies";
import { QueryKeyFactory } from "@shared/cache/queryKeys/queryKeyFactory";

import { useQueryWithInitial } from "@shared/hooks/useQueryWithInitial";

import { useCommunityArticleListFilterStore } from "@features/articles/communityArticleList/communityArticleList.store";

/**
 * useGetCommunityArticleList
 * - 필터 상태를 쿼리 키로 사용해 커뮤니티 게시물 리스트를 조회합니다.
 */
export const useGetCommunityArticleList = () => {
  const filter = useCommunityArticleListFilterStore(
    useShallow(state => ({
      postType: state.postType,
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
      queryKey: QueryKeyFactory.community.list(filter),
      queryFn: async () => await getCommunityArticleList(filter),
      ...CACHE_POLICIES.ARTICLE_LIST,
    },
    QueryKeyFactory.community.lists()
  );
};
