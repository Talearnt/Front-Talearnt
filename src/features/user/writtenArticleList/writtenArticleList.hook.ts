import {
  getWrittenCommunityArticleList,
  getWrittenMatchingArticleList,
} from "@features/user/writtenArticleList/writtenArticleList.api";

import { CACHE_POLICIES, QueryKeyFactory } from "@shared/utils/cacheManager";

import { useQueryWithInitial } from "@shared/hooks/useQueryWithInitial";

import {
  useWrittenCommunityArticlePageStore,
  useWrittenMatchingArticlePageStore,
} from "@features/user/writtenArticleList/writtenArticleList.store";

// 작성한 커뮤니티 게시글 목록 조회
export const useGetWrittenCommunityArticleList = (enabled: boolean) => {
  const page = useWrittenCommunityArticlePageStore(state => state.page);

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
      queryKey: QueryKeyFactory.user.written.community.list(page),
      queryFn: () => getWrittenCommunityArticleList({ page }),
      enabled,
      staleTime: CACHE_POLICIES.WRITTEN_LIST.staleTime,
      gcTime: CACHE_POLICIES.WRITTEN_LIST.gcTime,
    },
    QueryKeyFactory.user.written.community.all()
  );
};

// 작성한 매칭 게시글 목록 조회
export const useGetWrittenMatchingArticleList = (enabled: boolean) => {
  const page = useWrittenMatchingArticlePageStore(state => state.page);

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
      queryKey: QueryKeyFactory.user.written.matching.list(page),
      queryFn: () => getWrittenMatchingArticleList({ page }),
      enabled,
      staleTime: CACHE_POLICIES.WRITTEN_LIST.staleTime,
      gcTime: CACHE_POLICIES.WRITTEN_LIST.gcTime,
    },
    QueryKeyFactory.user.written.matching.all()
  );
};
