import { create } from "zustand";

import { pageStoreType } from "@shared/type/api.type";

// 작성한 댓글 목록 페이지 스토어
export const useWrittenCommentPageStore = create<pageStoreType>(set => ({
  page: 1,
  setPage: page => set({ page }),
}));

// 작성한 답변 목록 페이지 스토어
export const useWrittenReplyPageStore = create<pageStoreType>(set => ({
  page: 1,
  setPage: page => set({ page }),
}));
