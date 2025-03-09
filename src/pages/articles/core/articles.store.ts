import { create } from "zustand";

import { editMatchingArticleDataType } from "@pages/articles/WriteArticle/core/writeArticle.type";

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

type editMatchingArticleDataStoreType = {
  editMatchingArticle: editMatchingArticleDataType | null;
  setEditMatchingArticle: (
    editMatchingArticle: editMatchingArticleDataType | null
  ) => void;
};

export const useEditMatchingArticleDataStore =
  create<editMatchingArticleDataStoreType>(set => ({
    editMatchingArticle: null,
    setEditMatchingArticle: editMatchingArticle => set({ editMatchingArticle })
  }));
