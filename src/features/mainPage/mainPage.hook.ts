import { getCommunityArticleList } from "@features/articles/communityArticleList/communityArticleList.api";
import { getMatchingArticleList } from "@features/articles/matchingArticleList/matchingArticleList.api";

import { createQueryKey } from "@shared/utils/createQueryKey";

import { useGetProfile } from "@features/user/user.hook";
import { useQueryWithInitial } from "@shared/hooks/useQueryWithInitial";

import { useAuthStore } from "@store/user.store";

import { queryKeys } from "@shared/constants/queryKeys";

const MAIN_ARTICLES_LIST_SIZE = 10;

// 맞춤 매칭 게시물 목록
export const useGetPersonalizedMatchingArticleList = () => {
  const {
    data: {
      data: { giveTalents, receiveTalents },
    },
    isSuccess,
  } = useGetProfile();

  const isLoggedIn = useAuthStore(state => state.isLoggedIn);

  const queryKey = createQueryKey([queryKeys.MAIN, queryKeys.MATCHING], {
    isLoggedIn: true,
    isList: true,
  });

  return useQueryWithInitial(
    {
      results: [],
      pagination: {
        hasNext: false,
        hasPrevious: false,
        totalPages: 1,
        currentPage: 1,
        totalCount: 0,
        latestCreatedAt: "",
      },
    },
    {
      queryKey,
      queryFn: async () =>
        await getMatchingArticleList({
          giveTalents,
          receiveTalents,
          order: "recent",
          size: MAIN_ARTICLES_LIST_SIZE,
        }),
      enabled: isLoggedIn && isSuccess,
    }
  );
};

// 신규 매칭 게시물 목록
export const useGetRecentMatchingArticleList = () => {
  const queryKey = createQueryKey([queryKeys.MAIN, queryKeys.MATCHING], {
    isList: true,
  });

  return useQueryWithInitial(
    {
      results: [],
      pagination: {
        hasNext: false,
        hasPrevious: false,
        totalPages: 1,
        currentPage: 1,
        totalCount: 0,
        latestCreatedAt: "",
      },
    },
    {
      queryKey,
      queryFn: async () =>
        await getMatchingArticleList({
          order: "recent",
          size: MAIN_ARTICLES_LIST_SIZE,
        }),
    }
  );
};

// BEST 커뮤니티 게시물 목록
export const useGetBestCommunityArticleList = () => {
  const queryKey = createQueryKey([queryKeys.MAIN, queryKeys.COMMUNITY], {
    isList: true,
  });

  return useQueryWithInitial(
    {
      results: [],
      pagination: {
        hasNext: false,
        hasPrevious: false,
        totalPages: 1,
        currentPage: 1,
        totalCount: 0,
        latestCreatedAt: "",
      },
    },
    {
      queryKey,
      queryFn: async () =>
        await getCommunityArticleList({
          order: "hot",
          size: MAIN_ARTICLES_LIST_SIZE,
        }),
    }
  );
};
