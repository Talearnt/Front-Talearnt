import {
  getWrittenCommentList,
  getWrittenReplyList,
} from "@features/user/writtenCommentAndReplyList/writtenCommentAndReplyList.api";

import { createQueryKey } from "@shared/utils/createQueryKey";

import { useQueryWithInitial } from "@shared/hooks/useQueryWithInitial";

import {
  useWrittenCommentPageStore,
  useWrittenReplyPageStore,
} from "@features/user/writtenCommentAndReplyList/writtenCommentAndReplyList.store";

import { queryKeys } from "@shared/constants/queryKeys";

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
      queryKey: createQueryKey([queryKeys.WRITTEN_COMMENT, page], {
        isList: true,
      }),
      queryFn: () => getWrittenCommentList({ page }),
      enabled,
    },
    createQueryKey([queryKeys.WRITTEN_COMMENT], { isList: true })
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
      queryKey: createQueryKey([queryKeys.WRITTEN_REPLY, page], {
        isList: true,
      }),
      queryFn: () => getWrittenReplyList({ page }),
      enabled,
    },
    createQueryKey([queryKeys.WRITTEN_REPLY], { isList: true })
  );
};
