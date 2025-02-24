import { create } from "zustand";

type hasNewMatchingArticleStoreType = {
  hasNewMatchingArticle: boolean;
  setNewMatchingArticle: (hasNewMatchingArticle: boolean) => void;
};

const useHasNewMatchingArticleStore = create<hasNewMatchingArticleStoreType>(
  set => ({
    hasNewMatchingArticle: false,
    setNewMatchingArticle: hasNewMatchingArticle =>
      set({ hasNewMatchingArticle })
  })
);

export default useHasNewMatchingArticleStore;
