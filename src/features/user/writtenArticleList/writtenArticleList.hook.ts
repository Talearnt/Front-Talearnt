import {
  getWrittenCommunityArticleList,
  getWrittenMatchingArticleList,
} from "@features/user/writtenArticleList/writtenArticleList.api";

import { createQueryKey } from "@shared/utils/createQueryKey";

import { useQueryWithInitial } from "@shared/hooks/useQueryWithInitial";

import {
  useWrittenCommunityArticlePageStore,
  useWrittenMatchingArticlePageStore,
} from "@features/user/writtenArticleList/writtenArticleList.store";

import { queryKeys } from "@shared/constants/queryKeys";

// 작성한 커뮤니티 게시글 목록 조회
export const useGetWrittenCommunityArticleList = () => {
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
      queryKey: createQueryKey([queryKeys.WRITTEN_COMMUNITY, page], {
        isList: true,
      }),
      queryFn: () => getWrittenCommunityArticleList({ page }),
    },
    createQueryKey([queryKeys.WRITTEN_COMMUNITY], { isList: true })
  );
};

// 작성한 매칭 게시글 목록 조회
export const useGetWrittenMatchingArticleList = () => {
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
      queryKey: createQueryKey([queryKeys.WRITTEN_MATCHING, page], {
        isList: true,
      }),
      queryFn: () => getWrittenMatchingArticleList({ page }),
    },
    createQueryKey([queryKeys.WRITTEN_MATCHING], { isList: true })
  );
};
