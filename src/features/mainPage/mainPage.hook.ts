import { getCommunityArticleList } from "@features/articles/communityArticleList/communityArticleList.api";
import { getMatchingArticleList } from "@features/articles/matchingArticleList/matchingArticleList.api";

import { CACHE_POLICIES, QueryKeyFactory } from "@shared/utils/cacheManager";

import { useGetProfile } from "@features/user/profile/profile.hook";
import { useQueryWithInitial } from "@shared/hooks/useQueryWithInitial";

import { useAuthStore } from "@store/user.store";

const MAIN_ARTICLES_LIST_SIZE = 10;

// 맞춤 매칭 게시물 목록
export const useGetPersonalizedMatchingArticleList = () => {
  const isLoggedIn = useAuthStore(state => state.isLoggedIn);

  const {
    data: {
      data: { giveTalents, receiveTalents },
    },
    isSuccess,
  } = useGetProfile();

  // 맞춤 매칭 게시물 - 개인화된 데이터로 변동성 중간
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
      queryKey: QueryKeyFactory.main.matchingPersonalized(),
      queryFn: async () =>
        await getMatchingArticleList({
          giveTalents,
          receiveTalents,
          order: "recent",
          size: MAIN_ARTICLES_LIST_SIZE,
        }),
      enabled: isLoggedIn && isSuccess,
      staleTime: CACHE_POLICIES.MAIN_PERSONALIZED.staleTime,
      gcTime: CACHE_POLICIES.MAIN_PERSONALIZED.gcTime,
    }
  );
};

// 신규 매칭 게시물 목록
export const useGetRecentMatchingArticleList = () => {
  // 신규 매칭 게시물 - 최신 순으로 변동성이 높음
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
      queryKey: QueryKeyFactory.main.matchingRecent(),
      queryFn: async () =>
        await getMatchingArticleList({
          order: "recent",
          size: MAIN_ARTICLES_LIST_SIZE,
        }),
      staleTime: CACHE_POLICIES.MAIN_RECENT.staleTime,
      gcTime: CACHE_POLICIES.MAIN_RECENT.gcTime,
    }
  );
};

// BEST 커뮤니티 게시물 목록
export const useGetBestCommunityArticleList = () => {
  // 메인 페이지 커뮤니티 목록 - 인기 글 기준으로 변동성 중간
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
      queryKey: QueryKeyFactory.main.communityBest(),
      queryFn: async () =>
        await getCommunityArticleList({
          order: "hot",
          size: MAIN_ARTICLES_LIST_SIZE,
        }),
      staleTime: CACHE_POLICIES.MAIN_BEST.staleTime,
      gcTime: CACHE_POLICIES.MAIN_BEST.gcTime,
    }
  );
};
