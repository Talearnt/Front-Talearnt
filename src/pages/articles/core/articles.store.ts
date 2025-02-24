import { create } from "zustand";

type hasNewMatchingArticleStoreType = {
  hasNewMatchingArticle: boolean;
  setHasNewMatchingArticle: (hasNewMatchingArticle: boolean) => void;
};

export const useHasNewMatchingArticleStore =
  create<hasNewMatchingArticleStoreType>(set => ({
    hasNewMatchingArticle: false,
    setHasNewMatchingArticle: hasNewMatchingArticle =>
      set({ hasNewMatchingArticle })
  }));
