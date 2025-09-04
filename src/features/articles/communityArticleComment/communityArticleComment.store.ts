import { create } from "zustand";

type communityArticleCommentPageStoreType = {
  page: number;
  setPage: (page: number) => void;
};

// 커뮤니티 게시글 댓글 페이지 스토어
export const useCommunityArticleCommentPageStore =
  create<communityArticleCommentPageStoreType>(set => ({
    page: 0,
    setPage: page => set({ page }),
  }));
