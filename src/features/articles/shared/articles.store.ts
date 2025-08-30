import { create } from "zustand";

import { communityArticleDetailType } from "@features/articles/communityArticleDetail/communityArticleDetail.type";
import { matchingArticleDetailType } from "@features/articles/matchingArticleDetail/matchingArticleDetail.type";
import { communityArticleFormDataType } from "@features/articles/writeCommunityArticle/writeCommunityArticle.type";
import { matchingArticleFormDataType } from "@features/articles/writeMatchingArticle/writeMatchingArticle.type";

type writeMatchingArticleStoreType = {
  writeMatchingArticleId: number | null;
  setWriteMatchingArticleId: (id: number | null) => void;
};

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

export const useEditMatchingArticleDataStore =
  create<editMatchingArticleDataStoreType>(set => ({
    editMatchingArticle: null,
    setEditMatchingArticle: editMatchingArticle => set({ editMatchingArticle }),
  }));

type hasNewCommunityArticleStoreType = {
  hasNewCommunityArticle: boolean;
  setHasNewCommunityArticle: (hasNewCommunityArticle: boolean) => void;
};

export const useHasNewCommunityArticleStore =
  create<hasNewCommunityArticleStoreType>(set => ({
    hasNewCommunityArticle: false,
    setHasNewCommunityArticle: hasNewCommunityArticle =>
      set({ hasNewCommunityArticle }),
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

export const useEditCommunityArticleDataStore =
  create<editCommunityArticleDataStoreType>(set => ({
    editCommunityArticle: null,
    setEditCommunityArticle: editCommunityArticle =>
      set({ editCommunityArticle }),
  }));
