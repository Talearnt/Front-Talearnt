import { getFavoriteMatchingArticleList } from "@features/user/favoriteMatchingArticleList/favoriteMatchingArticleList.api";

import { useQueryWithInitial } from "@shared/hooks/useQueryWithInitial";

import { useFavoriteMatchingArticlePageStore } from "@features/user/favoriteMatchingArticleList/favoriteMatchingArticleList.store";

import { CACHE_POLICIES } from "@shared/cache/policies/cachePolicies";
import { QueryKeyFactory } from "@shared/cache/queryKeys/queryKeyFactory";

export const useGetFavoriteMatchingArticleList = () => {
  const page = useFavoriteMatchingArticlePageStore(state => state.page);

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
      queryKey: QueryKeyFactory.user.favoriteMatching.list(page),
      queryFn: () => getFavoriteMatchingArticleList({ page, size: 9 }),
      ...CACHE_POLICIES.FAVORITE_LIST,
    },
    QueryKeyFactory.user.favoriteMatching.all()
  );
};
