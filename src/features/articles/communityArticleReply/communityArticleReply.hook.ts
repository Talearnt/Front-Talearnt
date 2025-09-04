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
) =>
  useInfiniteQuery<
    customAxiosResponseType<paginationType<replyType>>,
    Error, // error 타입
    replyType[],
    unknown[],
    number | undefined
  >({
    enabled,
    queryKey: QueryKeyFactory.reply.lists(commentNo),
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

  return useMutation({
    mutationFn: async (content: string) =>
      await postCommunityArticleReply({ commentNo, content }),
    onMutate: async (content: string) => {
      /* [onMutate] 1) 활성 쿼리 취소 */
      await queryClient.cancelQueries({
        queryKey: QueryKeyFactory.comment.lists(postNo),
      });

      /* [onMutate] 2) 답글이 열려있는 경우에만 답글 목록 쿼리 취소 */
      if (isOpen) {
        await queryClient.cancelQueries({
          queryKey: QueryKeyFactory.reply.lists(commentNo),
        });
      }

      /* [onMutate] 3) 스냅샷 저장: 답글/댓글 */
      const prevReplies = isOpen
        ? queryClient.getQueryData<
            InfiniteData<customAxiosResponseType<paginationType<replyType>>>
          >(QueryKeyFactory.reply.lists(commentNo))
        : undefined;

      const commentQueries = queryClient.getQueriesData({
        queryKey: QueryKeyFactory.comment.lists(postNo),
      });
      const prevComments = commentQueries.map(
        ([key, data]) => [key, data] as const
      );

      /* [onMutate] 4) 답글이 열려있는 경우에만 답글 목록에 임시 답글 추가 (낙관적) */
      if (isOpen) {
        queryClient.setQueryData<
          InfiniteData<customAxiosResponseType<paginationType<replyType>>>
        >(QueryKeyFactory.reply.lists(commentNo), oldData => {
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
              // 마지막 페이지에 답글 추가
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

      /* [onMutate] 5) 댓글의 답글 수는 항상 증가 (답글이 열려있지 않아도 답글 수는 보여지므로) */
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

      /* [onMutate] 6) 반환: 롤백용 스냅샷 */
      return { prevReplies, prevComments };
    },
    onError: (_err, _variables, context) => {
      /* [onError] 이전 스냅샷으로 정확히 롤백 */
      if (context?.prevReplies) {
        queryClient.setQueryData(
          QueryKeyFactory.reply.lists(commentNo),
          context.prevReplies
        );
      }

      context?.prevComments.forEach(([key, data]) => {
        queryClient.setQueryData(key, data);
      });
    },
    onSuccess: ({ data: reply }) => {
      /* [onSuccess] 서버 응답으로 정확한 데이터 저장 */
      if (isOpen) {
        /* [onSuccess] 답글 목록 정규화 (마지막 페이지에 실제 답글로 교체) */
        queryClient.setQueryData<
          InfiniteData<customAxiosResponseType<paginationType<replyType>>>
        >(QueryKeyFactory.reply.lists(commentNo), oldData => {
          if (!oldData) {
            return oldData;
          }

          return {
            ...oldData,
            pages: oldData.pages.map((page, idx, array) => {
              if (idx === array.length - 1) {
                return {
                  ...page,
                  data: {
                    ...page.data,
                    results: page.data.results.map(r =>
                      r.replyNo === -1 ? reply : r
                    ),
                  },
                };
              }
              return page;
            }),
          };
        });
      }
    },
    onSettled: () => {
      /* [onSettled] 답글 목록 무효화 */
      void queryClient.invalidateQueries({
        queryKey: QueryKeyFactory.reply.lists(commentNo),
      });

      /* [onSettled] 댓글 목록도 무효화 (답글 수 변경) TODO: CHECK 답글 썼을 때 댓글 목록 무효화 하면 답글 위치가 변경되지않나 */
      void queryClient.invalidateQueries({
        queryKey: QueryKeyFactory.comment.lists(postNo),
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

  return useMutation({
    mutationFn: (content: string) =>
      putEditCommunityArticleReply({ replyNo, content }),
    onMutate: async (content: string) => {
      /* [onMutate] 1) 활성 쿼리 취소 */
      await queryClient.cancelQueries({
        queryKey: QueryKeyFactory.reply.lists(commentNo),
      });

      /* [onMutate] 2) 스냅샷 저장: 답글 */
      const prevReplies = queryClient.getQueryData<
        InfiniteData<customAxiosResponseType<paginationType<replyType>>>
      >(QueryKeyFactory.reply.lists(commentNo));

      /* [onMutate] 3) 답글 목록에서 해당 답글 수정 (낙관적) */
      queryClient.setQueryData<
        InfiniteData<customAxiosResponseType<paginationType<replyType>>>
      >(QueryKeyFactory.reply.lists(commentNo), oldData => {
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

      /* [onMutate] 4) 반환: 롤백용 스냅샷 */
      return { prevReplies };
    },
    onError: (_err, _variables, context) => {
      /* [onError] 이전 스냅샷으로 정확히 롤백 */
      if (context?.prevReplies) {
        queryClient.setQueryData(
          QueryKeyFactory.reply.lists(commentNo),
          context.prevReplies
        );
      }
    },
    onSettled: () => {
      /* [onSettled] 답글 목록 무효화 */
      void queryClient.invalidateQueries({
        queryKey: QueryKeyFactory.reply.lists(commentNo),
      });

      // 댓글 목록도 무효화 (답글 수 변경) TODO: CHECK 답글 썼을 때 댓글 목록 무효화 하면 답글 위치가 변경되지않나
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

  const postNo = Number(communityPostNo);

  return useMutation({
    mutationFn: () => deleteCommunityArticleReply(replyNo),
    onMutate: async () => {
      /* [onMutate] 1) 활성 쿼리 취소 */
      await queryClient.cancelQueries({
        queryKey: QueryKeyFactory.reply.lists(commentNo),
      });
      await queryClient.cancelQueries({
        queryKey: QueryKeyFactory.comment.lists(postNo),
      });

      /* [onMutate] 2) 스냅샷 저장: 답글/댓글 */
      const prevReplies = queryClient.getQueryData<
        InfiniteData<customAxiosResponseType<paginationType<replyType>>>
      >(QueryKeyFactory.reply.lists(commentNo));

      const commentQueries = queryClient.getQueriesData({
        queryKey: QueryKeyFactory.comment.lists(postNo),
      });
      const prevComments = commentQueries.map(
        ([key, data]) => [key, data] as const
      );

      /* [onMutate] 3) 답글 목록에서 해당 답글 삭제 표시 (낙관적) */
      queryClient.setQueryData<
        InfiniteData<customAxiosResponseType<paginationType<replyType>>>
      >(QueryKeyFactory.reply.lists(commentNo), oldData => {
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

      /* [onMutate] 4) 댓글의 답글 수 감소 (낙관적) */
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

      /* [onMutate] 5) 반환: 롤백용 스냅샷 */
      return { prevReplies, prevComments };
    },
    onError: (_err, _variables, context) => {
      /* [onError] 이전 스냅샷으로 정확히 롤백 */
      if (context?.prevReplies) {
        queryClient.setQueryData(
          QueryKeyFactory.reply.lists(commentNo),
          context.prevReplies
        );
      }

      context?.prevComments.forEach(([key, data]) => {
        queryClient.setQueryData(key, data);
      });
    },
    onSettled: () => {
      /* [onSettled] 답글 목록 무효화 */
      void queryClient.invalidateQueries({
        queryKey: QueryKeyFactory.reply.lists(commentNo),
      });

      /* [onSettled] 댓글 목록도 무효화 (답글 수 변경) TODO: CHECK 답글 썼을 때 댓글 목록 무효화 하면 답글 위치가 변경되지않나 */
      void queryClient.invalidateQueries({
        queryKey: QueryKeyFactory.comment.lists(postNo),
      });
    },
  });
};
