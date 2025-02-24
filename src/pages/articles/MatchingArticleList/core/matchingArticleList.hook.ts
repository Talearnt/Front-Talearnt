import { useShallow } from "zustand/shallow";

import { getMatchingArticleList } from "@pages/articles/MatchingArticleList/core/matchingArticleList.api";

import { createQueryKey } from "@utils/queryKey";

import { useQueryWithInitial } from "@hook/useQueryWithInitial";

import useFilterStore from "@pages/articles/MatchingArticleList/core/matchingArticleList.store";

export const useGetMatchingArticleList = () => {
  const filter = useFilterStore(
    useShallow(state => ({
      giveTalents: state.giveTalents,
      receiveTalents: state.receiveTalents,
      duration: state.duration,
      type: state.type,
      status: state.status,
      order: state.order,
      page: state.page
    }))
  );

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
      queryKey: createQueryKey(["MATCH", filter], { isArticleList: true }),
      queryFn: async () => await getMatchingArticleList(filter)
    }
  );
};
