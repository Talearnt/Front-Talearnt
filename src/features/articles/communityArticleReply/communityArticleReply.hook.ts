import { useParams } from "react-router-dom";

import type { InfiniteData } from "@tanstack/query-core";
import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import {
  deleteCommunityArticleReply,
  getCommunityArticleReplyList,
  postCommunityArticleReply,
  putEditCommunityArticleReply,
} from "@features/articles/communityArticleReply/communityArticleReply.api";

import { CACHE_POLICIES } from "@shared/cache/policies/cachePolicies";
import { QueryKeyFactory } from "@shared/cache/queryKeys/queryKeyFactory";

import { useGetProfile } from "@features/user/profile/profile.hook";

import { useToastStore } from "@store/toast.store";

import {
  commentType,
  replyType,
} from "@features/articles/shared/articles.type";
import { customAxiosResponseType, paginationType } from "@shared/type/api.type";

/**
 * useGetCommunityArticleReplyList
 * - 커뮤니티 게시글 답글 리스트를 조회합니다.
 */
export const useGetCommunityArticleReplyList = (
  commentNo: number,
  enabled: boolean
) => {
  const { communityPostNo } = useParams();

  const postNo = Number(communityPostNo);

  return useInfiniteQuery<
    customAxiosResponseType<paginationType<replyType>>,
    Error, // error 타입
    replyType[],
    unknown[],
    number | undefined
  >({
    enabled,
    queryKey: QueryKeyFactory.reply.list(postNo, commentNo),
    queryFn: ({ pageParam }) =>
      getCommunityArticleReplyList({ commentNo, lastNo: pageParam }),
    getPreviousPageParam: lastPage =>
      lastPage.data.pagination.hasNext
        ? lastPage.data.results[0].replyNo
        : undefined,
    getNextPageParam: () => undefined,
    select: data => data.pages.flatMap(page => page.data.results),
    initialPageParam: undefined,
    ...CACHE_POLICIES.REPLY_LIST,
  });
};

/**
 * usePostCommunityArticleReply
 * - 커뮤니티 게시글 답글 작성 요청을 담당하는 훅입니다.
 * - 답글 목록 캐시를 낙관적 업데이트로 동기화하고, 실패 시 스냅샷으로 롤백합니다.
 */
export const usePostCommunityArticleReply = (
  commentNo: number,
  isOpen: boolean
) => {
  const { communityPostNo } = useParams();

  const queryClient = useQueryClient();

  const {
    data: {
      data: { profileImg, nickname, userNo },
    },
  } = useGetProfile();

  const postNo = Number(communityPostNo);
  const commentQueryKey = QueryKeyFactory.comment.lists(postNo);
  const replyQueryKey = QueryKeyFactory.reply.list(postNo, commentNo);

  return useMutation({
    mutationFn: async (content: string) =>
      await postCommunityArticleReply({ commentNo, content }),
    onMutate: async (content: string) => {
      /**
       * [onMutate] 낙관적 업데이트
       *
       * 즉각 반응: 사용자가 작성한 답글을 즉시 UI에 표시 (답글이 열려있는 경우만)
       * 동시성: onSettled에서 refetch하여 다른 사용자의 답글도 반영
       */

      /* 1) 활성 쿼리 취소 */
      await queryClient.cancelQueries({
        queryKey: commentQueryKey,
      });

      if (isOpen) {
        await queryClient.cancelQueries({
          queryKey: replyQueryKey,
        });
      }

      /* 2) 스냅샷 저장 (롤백용) */
      const prevReplies = isOpen
        ? queryClient.getQueryData<
            InfiniteData<customAxiosResponseType<paginationType<replyType>>>
          >(replyQueryKey)
        : undefined;

      const commentQueries = queryClient.getQueriesData({
        queryKey: commentQueryKey,
      });
      const prevComments = commentQueries.map(
        ([key, data]) => [key, data] as const
      );

      /* 3) 답글이 열려있으면 임시 답글 추가 (ID: -1) */
      if (isOpen) {
        queryClient.setQueryData<
          InfiniteData<customAxiosResponseType<paginationType<replyType>>>
        >(replyQueryKey, oldData => {
          if (!oldData) {
            return oldData;
          }

          const optimisticReply: replyType = {
            replyNo: -1,
            content,
            createdAt: new Date().toISOString(),
            userNo,
            nickname,
            profileImg,
            isDeleted: false,
          };

          return {
            ...oldData,
            pages: oldData.pages.map((page, idx, array) => {
              if (idx === array.length - 1) {
                return {
                  ...page,
                  data: {
                    ...page.data,
                    results: [...page.data.results, optimisticReply],
                  },
                };
              }
              return page;
            }),
          };
        });
      }

      /* 4) 댓글의 replyCount 증가 (답글 열림 여부와 관계없이) */
      commentQueries.forEach(([key]) => {
        queryClient.setQueryData<
          customAxiosResponseType<paginationType<commentType>>
        >(key, oldData => {
          if (!oldData) {
            return oldData;
          }

          return {
            ...oldData,
            data: {
              ...oldData.data,
              results: oldData.data.results.map(comment =>
                comment.commentNo === commentNo
                  ? { ...comment, replyCount: comment.replyCount + 1 }
                  : comment
              ),
            },
          };
        });
      });

      return { prevReplies, prevComments };
    },
    onError: (_err, _variables, context) => {
      /* [onError] 실패 시 롤백 */
      if (context?.prevReplies) {
        queryClient.setQueryData(replyQueryKey, context.prevReplies);
      }

      context?.prevComments.forEach(([key, data]) => {
        queryClient.setQueryData(key, data);
      });
    },
    onSettled: () => {
      /**
       * [onSettled] 동시성을 고려한 refetch 전략
       *
       * ✅ 답글 목록: 작성 중 다른 사용자가 작성한 답글도 함께 가져오기 위해 refetch
       * ✅ 댓글 목록: 서버의 정확한 답글 수(replyCount) 확인
       * ✅ 내가 작성한 답글 목록: 최신순 정렬 보장
       *
       * [중요] 낙관적 업데이트만으로는 동시성 문제 발생:
       * 내가 답글 작성 중에 다른 사람이 작성한 답글을 놓칠 수 있음
       */

      /* 답글 목록 refetch (다른 사용자의 답글도 반영) */
      void queryClient.invalidateQueries({
        queryKey: replyQueryKey,
      });

      /* 댓글 목록 무효화 (서버의 정확한 답글 수 확인) */
      void queryClient.invalidateQueries({
        queryKey: commentQueryKey,
      });

      /* 내가 작성한 답글 목록 refetch (최신순 정렬 보장) */
      void queryClient.invalidateQueries({
        predicate: ({ queryKey }) =>
          QueryKeyFactory.user.written.reply
            .all()
            .every(key => queryKey.includes(key)),
      });
    },
  });
};

/**
 * usePutEditCommunityArticleReply
 * - 커뮤니티 게시글 답글 수정 요청을 담당하는 훅입니다.
 * - 답글 목록 캐시를 낙관적 업데이트로 동기화하고, 실패 시 스냅샷으로 롤백합니다.
 */
export const usePutEditCommunityArticleReply = (
  commentNo: number,
  replyNo: number
) => {
  const { communityPostNo } = useParams();

  const queryClient = useQueryClient();

  const postNo = Number(communityPostNo);
  const replyQueryKey = QueryKeyFactory.reply.list(postNo, commentNo);

  return useMutation({
    mutationFn: (content: string) =>
      putEditCommunityArticleReply({ replyNo, content }),
    onMutate: async (content: string) => {
      /**
       * [onMutate] 낙관적 업데이트
       *
       * 즉각 반응: 수정된 답글을 즉시 UI에 표시
       * 동시성: 수정은 내 글만 영향, onSettled refetch로 추가 보장
       */

      /* 1) 활성 쿼리 취소 */
      await queryClient.cancelQueries({
        queryKey: replyQueryKey,
      });

      /* 2) 스냅샷 저장 (롤백용) */
      const prevReplies =
        queryClient.getQueryData<
          InfiniteData<customAxiosResponseType<paginationType<replyType>>>
        >(replyQueryKey);

      /* 3) 답글 내용 즉시 업데이트 */
      queryClient.setQueryData<
        InfiniteData<customAxiosResponseType<paginationType<replyType>>>
      >(replyQueryKey, oldData => {
        if (!oldData) {
          return oldData;
        }

        return {
          ...oldData,
          pages: oldData.pages.map(page => ({
            ...page,
            data: {
              ...page.data,
              results: page.data.results.map(reply =>
                reply.replyNo === replyNo
                  ? { ...reply, content, updatedAt: new Date().toISOString() }
                  : reply
              ),
            },
          })),
        };
      });

      return { prevReplies };
    },
    onError: (_err, _variables, context) => {
      /* [onError] 실패 시 롤백 */
      if (context?.prevReplies) {
        queryClient.setQueryData(replyQueryKey, context.prevReplies);
      }
    },
    onSettled: () => {
      /**
       * [onSettled] refetch로 최종 확인
       *
       * 수정 중 다른 변경사항도 함께 반영
       */
      void queryClient.invalidateQueries({
        queryKey: replyQueryKey,
      });

      void queryClient.invalidateQueries({
        queryKey: QueryKeyFactory.comment.lists(postNo),
      });
    },
  });
};

/**
 * useDeleteCommunityArticleReply
 * - 커뮤니티 게시글 답글 삭제 요청을 담당하는 훅입니다.
 * - 답글 목록 캐시를 낙관적 업데이트로 동기화하고, 실패 시 스냅샷으로 롤백합니다.
 */
export const useDeleteCommunityArticleReply = (
  commentNo: number,
  replyNo: number
) => {
  const { communityPostNo } = useParams();

  const queryClient = useQueryClient();

  const setToast = useToastStore(state => state.setToast);

  const postNo = Number(communityPostNo);
  const commentQueryKey = QueryKeyFactory.comment.lists(postNo);
  const replyQueryKey = QueryKeyFactory.reply.list(postNo, commentNo);

  return useMutation({
    mutationFn: () => deleteCommunityArticleReply(replyNo),
    onMutate: async () => {
      /**
       * [onMutate] 낙관적 업데이트
       *
       * 즉각 반응: 삭제된 답글을 즉시 UI에서 표시
       * 동시성: onSettled에서 refetch하여 다른 사용자의 답글도 반영
       */

      /* 1) 활성 쿼리 취소 */
      await queryClient.cancelQueries({
        queryKey: replyQueryKey,
      });
      await queryClient.cancelQueries({
        queryKey: commentQueryKey,
      });

      /* 2) 스냅샷 저장 (롤백용) */
      const prevReplies =
        queryClient.getQueryData<
          InfiniteData<customAxiosResponseType<paginationType<replyType>>>
        >(replyQueryKey);

      const commentQueries = queryClient.getQueriesData({
        queryKey: commentQueryKey,
      });
      const prevComments = commentQueries.map(
        ([key, data]) => [key, data] as const
      );

      /* 3) 답글 isDeleted 표시 */
      queryClient.setQueryData<
        InfiniteData<customAxiosResponseType<paginationType<replyType>>>
      >(replyQueryKey, oldData => {
        if (!oldData) {
          return oldData;
        }

        return {
          ...oldData,
          pages: oldData.pages.map(page => ({
            ...page,
            data: {
              ...page.data,
              results: page.data.results.map(reply =>
                reply.replyNo === replyNo
                  ? { ...reply, isDeleted: true }
                  : reply
              ),
            },
          })),
        };
      });

      /* 4) 댓글의 replyCount 감소 */
      commentQueries.forEach(([key]) => {
        queryClient.setQueryData<
          customAxiosResponseType<paginationType<commentType>>
        >(key, oldData => {
          if (!oldData) {
            return oldData;
          }

          return {
            ...oldData,
            data: {
              ...oldData.data,
              results: oldData.data.results.map(comment =>
                comment.commentNo === commentNo
                  ? {
                      ...comment,
                      replyCount: Math.max(0, comment.replyCount - 1),
                    }
                  : comment
              ),
            },
          };
        });
      });

      return { prevReplies, prevComments };
    },
    onError: (_err, _variables, context) => {
      /* [onError] 실패 시 롤백 */
      if (context?.prevReplies) {
        queryClient.setQueryData(replyQueryKey, context.prevReplies);
      }

      context?.prevComments.forEach(([key, data]) => {
        queryClient.setQueryData(key, data);
      });
    },
    onSuccess: () => setToast({ message: "답글이 삭제되었습니다." }),
    onSettled: () => {
      /**
       * [onSettled] 동시성을 고려한 선택적 refetch
       *
       * ✅ 답글 목록: 삭제 중 다른 사용자가 작성한 답글도 함께 가져오기 (안전한 방식)
       * ✅ 댓글 목록: 서버의 정확한 답글 수(replyCount) 확인
       * ✅ 내가 작성한 답글 목록: 삭제된 항목 제거 확인
       *
       * [참고] 낙관적 업데이트만으로도 충분하지만, refetch로 완전한 동기화 보장
       */

      /* 답글 목록 refetch (삭제 중 작성된 다른 답글도 반영) */
      void queryClient.invalidateQueries({
        queryKey: replyQueryKey,
      });

      /* 댓글 목록 무효화 (서버의 정확한 답글 수 확인) */
      void queryClient.invalidateQueries({
        queryKey: commentQueryKey,
      });

      /* 내가 작성한 답글 목록 refetch */
      void queryClient.invalidateQueries({
        predicate: ({ queryKey }) =>
          QueryKeyFactory.user.written.reply
            .all()
            .every(key => queryKey.includes(key)),
      });
    },
  });
};
