import { create } from "zustand";

import { communityArticleListFilterType } from "@features/articles/communityArticleList/communityArticleList.type";

type communityArticleListFilterStoreType = communityArticleListFilterType & {
  setFilter: (
    updater: (
      prev: communityArticleListFilterType
    ) => communityArticleListFilterType
  ) => void;
  resetFilters: () => void;
};

export const useCommunityArticleListFilterStore =
  create<communityArticleListFilterStoreType>(set => ({
    postType: undefined,
    page: 1,
    setFilter: updater => set(state => updater(state)),
    resetFilters: () =>
      set({
        postType: undefined,
        page: 1,
      }),
  }));
