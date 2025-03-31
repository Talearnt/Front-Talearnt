import { create } from "zustand";

type communityArticleCommentPageStoreType = {
  page: number;
  setPage: (page: number) => void;
};

export const useCommunityArticleCommentPageStore =
  create<communityArticleCommentPageStoreType>(set => ({
    page: 0,
    setPage: page => set({ page })
  }));
