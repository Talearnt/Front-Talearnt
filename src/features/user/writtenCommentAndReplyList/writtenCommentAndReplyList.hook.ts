import {
  getWrittenCommentList,
  getWrittenReplyList,
} from "@features/user/writtenCommentAndReplyList/writtenCommentAndReplyList.api";

import { CACHE_POLICIES, QueryKeyFactory } from "@shared/utils/cacheManager";

import { useQueryWithInitial } from "@shared/hooks/useQueryWithInitial";

import {
  useWrittenCommentPageStore,
  useWrittenReplyPageStore,
} from "@features/user/writtenCommentAndReplyList/writtenCommentAndReplyList.store";

// 작성한 댓글 목록 조회
export const useGetWrittenCommentList = (enabled: boolean) => {
  const page = useWrittenCommentPageStore(state => state.page);

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
      queryKey: QueryKeyFactory.user.written.comment.list(page),
      queryFn: () => getWrittenCommentList({ page }),
      enabled,
      staleTime: CACHE_POLICIES.WRITTEN_LIST.staleTime,
      gcTime: CACHE_POLICIES.WRITTEN_LIST.gcTime,
    },
    QueryKeyFactory.user.written.comment.all()
  );
};

// 작성한 답변 목록 조회
export const useGetWrittenReplyList = (enabled: boolean) => {
  const page = useWrittenReplyPageStore(state => state.page);

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
      queryKey: QueryKeyFactory.user.written.reply.list(page),
      queryFn: () => getWrittenReplyList({ page }),
      enabled,
      staleTime: CACHE_POLICIES.WRITTEN_LIST.staleTime,
      gcTime: CACHE_POLICIES.WRITTEN_LIST.gcTime,
    },
    QueryKeyFactory.user.written.reply.all()
  );
};
