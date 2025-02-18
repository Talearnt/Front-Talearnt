import { getMatchingArticleList } from "@pages/articles/MatchingArticleList/core/matchingArticleList.api";

import { createQueryKey } from "@utils/queryKey";

import { useQueryWithInitial } from "@hook/useQueryWithInitial";

export const useGetMatchingArticleList = () => {
  return useQueryWithInitial(
    {
      results: [],
      pagination: {
        hasNext: false,
        hasPrevious: false,
        totalPages: 0,
        currentPage: 0
      }
    },
    {
      queryKey: createQueryKey(["MATCH"], { isArticleList: true }),
      queryFn: async () => await getMatchingArticleList()
    }
  );
};
