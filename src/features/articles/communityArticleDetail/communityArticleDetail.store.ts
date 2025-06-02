import { create } from "zustand";

type communityArticleCommentPageStoreType = {
  page: number;
  setPage: (page: number) => void;
};

export const useCommunityArticleCommentPageStore =
  create<communityArticleCommentPageStoreType>(set => ({
    page: 0,
    setPage: page => set({ page }),
  }));

type communityArticleCommentDeletedAtStoreType = {
  deletedAt: string | undefined;
  setDeletedAt: (deletedAt: string | undefined) => void;
};

export const useCommunityArticleCommentDeletedAtStore =
  create<communityArticleCommentDeletedAtStoreType>(set => ({
    deletedAt: undefined,
    setDeletedAt: deletedAt => set({ deletedAt }),
  }));
