import { getCommunityArticleList } from "@pages/articles/CommunityArticleList/core/communityArticleList.api";
import { getMatchingArticleList } from "@pages/articles/MatchingArticleList/core/matchingArticleList.api";

import { createQueryKey } from "@utils/createQueryKey";

import { useQueryWithInitial } from "@hook/useQueryWithInitial";
import { useGetProfile } from "@hook/user.hook";

import { useAuthStore } from "@pages/auth/core/auth.store";

import { queryKeys } from "@common/common.constants";

const MAIN_ARTICLES_LIST_SIZE = 10;

// 맞춤 매칭 게시물 목록
export const useGetPersonalizedMatchingArticleList = () => {
  const {
    data: {
      data: { giveTalents, receiveTalents }
    },
    isSuccess
  } = useGetProfile();

  const isLoggedIn = useAuthStore(state => state.isLoggedIn);

  const queryKey = createQueryKey([queryKeys.MAIN, queryKeys.MATCHING], {
    isLoggedIn: true,
    isList: true
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
        latestCreatedAt: ""
      }
    },
    {
      queryKey,
      queryFn: async () =>
        await getMatchingArticleList({
          giveTalents,
          receiveTalents,
          order: "recent",
          size: MAIN_ARTICLES_LIST_SIZE
        }),
      enabled: isLoggedIn && isSuccess
    }
  );
};

// 신규 매칭 게시물 목록
export const useGetRecentMatchingArticleList = () => {
  const queryKey = createQueryKey([queryKeys.MAIN, queryKeys.MATCHING], {
    isList: true
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
        latestCreatedAt: ""
      }
    },
    {
      queryKey,
      queryFn: async () =>
        await getMatchingArticleList({
          order: "recent",
          size: MAIN_ARTICLES_LIST_SIZE
        })
    }
  );
};

// BEST 커뮤니티 게시물 목록
export const useGetHotCommunityArticleList = () => {
  const queryKey = createQueryKey([queryKeys.MAIN, queryKeys.COMMUNITY], {
    isList: true
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
        latestCreatedAt: ""
      }
    },
    {
      queryKey,
      queryFn: async () =>
        await getCommunityArticleList({
          order: "hot",
          size: MAIN_ARTICLES_LIST_SIZE
        })
    }
  );
};
