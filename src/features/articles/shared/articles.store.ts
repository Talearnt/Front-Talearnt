import { create } from "zustand";

import { communityArticleDetailType } from "@features/articles/communityArticleDetail/communityArticleDetail.type";
import { matchingArticleDetailType } from "@features/articles/matchingArticleDetail/matchingArticleDetail.type";
import { communityArticleFormDataType } from "@features/articles/writeCommunityArticle/writeCommunityArticle.type";
import { matchingArticleFormDataType } from "@features/articles/writeMatchingArticle/writeMatchingArticle.type";

type writeMatchingArticleStoreType = {
  writeMatchingArticleId: number | null;
  setWriteMatchingArticleId: (id: number | null) => void;
};

/**
 * useWriteMatchingArticleStore
 * - 새로 작성된 매칭 게시물의 ID를 저장해 목록에서 하이라이트/애니메이션에 활용합니다.
 */
export const useWriteMatchingArticleStore =
  create<writeMatchingArticleStoreType>(set => ({
    writeMatchingArticleId: null,
    setWriteMatchingArticleId: id => set({ writeMatchingArticleId: id }),
  }));

type editMatchingArticleDataStoreType = {
  editMatchingArticle:
    | (matchingArticleFormDataType &
        Pick<matchingArticleDetailType, "exchangePostNo">)
    | null;
  setEditMatchingArticle: (
    editMatchingArticle:
      | (matchingArticleFormDataType &
          Pick<matchingArticleDetailType, "exchangePostNo">)
      | null
  ) => void;
};

/**
 * useEditMatchingArticleDataStore
 * - 매칭 게시물 편집 시, 폼에 전달할 초기값과 대상 게시물 ID를 보관합니다.
 */
export const useEditMatchingArticleDataStore =
  create<editMatchingArticleDataStoreType>(set => ({
    editMatchingArticle: null,
    setEditMatchingArticle: editMatchingArticle => set({ editMatchingArticle }),
  }));

type writeCommunityArticleStoreType = {
  writeCommunityArticleId: number | null;
  setWriteCommunityArticleId: (id: number | null) => void;
};

/**
 * useWriteCommunityArticleStore
 * - 새로 작성된 커뮤니티 게시물의 ID를 저장해 목록에서 하이라이트/애니메이션에 활용합니다.
 */
export const useWriteCommunityArticleStore =
  create<writeCommunityArticleStoreType>(set => ({
    writeCommunityArticleId: null,
    setWriteCommunityArticleId: id => set({ writeCommunityArticleId: id }),
  }));

type editCommunityArticleDataStoreType = {
  editCommunityArticle:
    | (communityArticleFormDataType &
        Pick<communityArticleDetailType, "communityPostNo">)
    | null;
  setEditCommunityArticle: (
    editCommunityArticle:
      | (communityArticleFormDataType &
          Pick<communityArticleDetailType, "communityPostNo">)
      | null
  ) => void;
};

/**
 * useEditCommunityArticleDataStore
 * - 커뮤니티 게시물 편집 시, 폼에 전달할 초기값과 대상 게시물 ID를 보관합니다.
 */
export const useEditCommunityArticleDataStore =
  create<editCommunityArticleDataStoreType>(set => ({
    editCommunityArticle: null,
    setEditCommunityArticle: editCommunityArticle =>
      set({ editCommunityArticle }),
  }));
