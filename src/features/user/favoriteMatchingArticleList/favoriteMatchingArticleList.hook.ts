import { getFavoriteMatchingArticleList } from "@features/user/favoriteMatchingArticleList/favoriteMatchingArticleList.api";

import { createQueryKey } from "@shared/utils/createQueryKey";

import { useQueryWithInitial } from "@shared/hooks/useQueryWithInitial";

import { useFavoriteMatchingArticlePageStore } from "@features/user/favoriteMatchingArticleList/favoriteMatchingArticleList.store";

import { queryKeys } from "@shared/constants/queryKeys";

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
      queryKey: createQueryKey([queryKeys.FAVORITE_MATCHING, page], {
        isList: true,
      }),
      queryFn: () => getFavoriteMatchingArticleList({ page, size: 9 }),
    },
    createQueryKey([queryKeys.FAVORITE_MATCHING], { isList: true })
  );
};
