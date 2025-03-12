import { create } from "zustand";

import { matchingArticleListFilterType } from "@pages/articles/MatchingArticleList/core/matchingArticleList.type";

type matchingArticleListFilterStoreType = matchingArticleListFilterType & {
  setFilter: (
    updater: (
      prev: matchingArticleListFilterType
    ) => matchingArticleListFilterType
  ) => void;
  resetFilters: () => void;
};

export const useMatchingArticleListFilterStore =
  create<matchingArticleListFilterStoreType>(set => ({
    giveTalents: [],
    receiveTalents: [],
    order: "recent",
    duration: undefined,
    type: undefined,
    status: undefined,
    page: 1,
    setFilter: updater => set(state => updater(state)),
    resetFilters: () =>
      set({
        giveTalents: [],
        receiveTalents: [],
        order: "recent",
        duration: undefined,
        type: undefined,
        status: undefined,
        page: 1
      })
  }));
