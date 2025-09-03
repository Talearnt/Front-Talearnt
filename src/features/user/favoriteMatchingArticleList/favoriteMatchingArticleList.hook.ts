import { getFavoriteMatchingArticleList } from "@features/user/favoriteMatchingArticleList/favoriteMatchingArticleList.api";

import { CACHE_POLICIES, QueryKeyFactory } from "@shared/utils/cacheManager";

import { useQueryWithInitial } from "@shared/hooks/useQueryWithInitial";

import { useFavoriteMatchingArticlePageStore } from "@features/user/favoriteMatchingArticleList/favoriteMatchingArticleList.store";

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
      staleTime: CACHE_POLICIES.FAVORITE_LIST.staleTime,
      gcTime: CACHE_POLICIES.FAVORITE_LIST.gcTime,
    },
    QueryKeyFactory.user.favoriteMatching.all()
  );
};
