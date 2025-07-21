import { create } from "zustand";

import { pageStoreType } from "@shared/type/api.type";

// 작성한 매칭 게시글 목록 페이지 스토어
export const useWrittenMatchingArticlePageStore = create<pageStoreType>(
  set => ({
    page: 1,
    setPage: page => set({ page }),
  })
);

// 작성한 커뮤니티 게시글 목록 페이지 스토어
export const useWrittenCommunityArticlePageStore = create<pageStoreType>(
  set => ({
    page: 1,
    setPage: page => set({ page }),
  })
);
