import { useParams } from "react-router-dom";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  deleteCommunityArticleComment,
  getCommunityArticleCommentList,
  postCommunityArticleComment,
  putEditCommunityArticleComment,
} from "@features/articles/communityArticleComment/communityArticleComment.api";

import { CACHE_POLICIES } from "@shared/cache/policies/cachePolicies";
import { QueryKeyFactory } from "@shared/cache/queryKeys/queryKeyFactory";

import { useGetCommunityArticleDetail } from "@features/articles/communityArticleDetail/communityArticleDetail.hook";
import { useGetProfile } from "@features/user/profile/profile.hook";
import { useQueryWithInitial } from "@shared/hooks/useQueryWithInitial";

import { useCommunityArticleCommentPageStore } from "@features/articles/communityArticleComment/communityArticleComment.store";

import { communityArticleDetailType } from "@features/articles/communityArticleDetail/communityArticleDetail.type";
import { commentType } from "@features/articles/shared/articles.type";
import { customAxiosResponseType, paginationType } from "@shared/type/api.type";

/**
 * useGetCommunityArticleCommentList
 * - 커뮤니티 게시글 댓글 리스트를 조회합니다.
 */
export const useGetCommunityArticleCommentList = () => {
  const { communityPostNo } = useParams();

  const page = useCommunityArticleCommentPageStore(state => state.page);

  const postNo = Number(communityPostNo);

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
      queryKey: QueryKeyFactory.comment.list(postNo, page),
      queryFn: () =>
        getCommunityArticleCommentList({
          communityPostNo: postNo,
          page,
        }),
      enabled: communityPostNo !== undefined && page !== 0,
      ...CACHE_POLICIES.COMMENT_LIST,
    },
    QueryKeyFactory.comment.lists(postNo)
  );
};

/**
 * usePostCommunityArticleComment
 * - 커뮤니티 게시글 댓글 작성 요청을 담당하는 훅입니다.
 * - 상세/리스트 캐시를 낙관적 업데이트로 동기화하고, 실패 시 스냅샷으로 롤백합니다.
 */
export const usePostCommunityArticleComment = () => {
  const { communityPostNo } = useParams();

  const queryClient = useQueryClient();

  const {
    data: {
      data: { commentLastPage },
    },
  } = useGetCommunityArticleDetail();
  const {
    data: {
      data: { profileImg, nickname, userNo },
    },
  } = useGetProfile();

  const postNo = Number(communityPostNo);

  return useMutation({
    mutationFn: (content: string) =>
      postCommunityArticleComment({ communityPostNo: postNo, content }),
    onMutate: async (content: string) => {
      /* [onMutate] 1) 활성 쿼리 취소 */
      await queryClient.cancelQueries({
        queryKey: QueryKeyFactory.comment.lists(postNo),
      });
      await queryClient.cancelQueries({
        queryKey: QueryKeyFactory.community.detail(postNo),
      });

      /* [onMutate] 2) 스냅샷 저장: 상세/댓글 */
      const prevDetail = queryClient.getQueryData(
        QueryKeyFactory.community.detail(postNo)
      );
      const commentQueries = queryClient.getQueriesData({
        queryKey: QueryKeyFactory.comment.lists(postNo),
      });
      const prevComments = commentQueries.map(
        ([key, data]) => [key, data] as const
      );

      /* [onMutate] 3) 마지막 페이지가 가득 찼는지 확인 */
      const lastPageKey = QueryKeyFactory.comment.list(
        postNo,
        commentLastPage || 1
      );
      const lastPageData =
        queryClient.getQueryData<
          customAxiosResponseType<paginationType<commentType>>
        >(lastPageKey);

      /* [onMutate] 4) 마지막 페이지가 30개로 가득 찬 경우 새 페이지에 추가 */
      const targetPage =
        lastPageData && lastPageData.data.results.length >= 30
          ? (commentLastPage || 1) + 1
          : commentLastPage || 1;

      /* [onMutate] 5) 상세 페이지 댓글 마지막 페이지 업데이트 */
      queryClient.setQueryData<
        customAxiosResponseType<communityArticleDetailType>
      >(QueryKeyFactory.community.detail(postNo), oldData => {
        if (!oldData) {
          return oldData;
        }

        return {
          ...oldData,
          data: {
            ...oldData.data,
            commentLastPage: targetPage,
          },
        };
      });

      const targetKey = QueryKeyFactory.comment.list(postNo, targetPage);

      /* [onMutate] 6) 새 페이지 댓글 추가 */
      queryClient.setQueryData<
        customAxiosResponseType<paginationType<commentType>>
      >(targetKey, oldData => {
        const optimisticComment: commentType = {
          commentNo: -1,
          content,
          createdAt: new Date().toISOString(),
          userNo,
          nickname,
          profileImg,
          replyCount: 0,
          isDeleted: false,
        };

        // 새 페이지인 경우 초기 데이터 구조 생성
        if (!oldData) {
          return {
            data: {
              results: [optimisticComment],
              pagination: {
                hasNext: false,
                hasPrevious: targetPage > 1,
                totalPages: targetPage,
                currentPage: targetPage,
                totalCount: (lastPageData?.data.pagination.totalCount || 0) + 1,
                latestCreatedAt: new Date().toISOString(),
              },
            },
            errorCode: null,
            errorMessage: null,
            success: true,
            status: 200,
          };
        }

        // 기존 페이지인 경우 댓글 추가
        return {
          ...oldData,
          data: {
            ...oldData.data,
            results: [...oldData.data.results, optimisticComment],
            pagination: {
              ...oldData.data.pagination,
              totalCount: oldData.data.pagination.totalCount + 1,
            },
          },
        };
      });

      /* [onMutate] 7) 반환: 롤백용 스냅샷 */
      return { prevDetail, prevComments, targetKey };
    },
    /* [onError] 실패 시 스냅샷으로 롤백 */
    onError: (_err, _variables, context) => {
      if (context?.prevDetail) {
        queryClient.setQueryData(
          QueryKeyFactory.community.detail(postNo),
          context.prevDetail
        );
      }

      context?.prevComments.forEach(([key, data]) => {
        queryClient.setQueryData(key, data);
      });
    },
    onSuccess: ({ data: newComment }, _variables, { targetKey }) =>
      /* [onSuccess] 서버 응답으로 정확한 데이터 저장 + 상세 페이지 댓글 마지막 페이지 업데이트 */
      queryClient.setQueryData<
        customAxiosResponseType<paginationType<commentType>>
      >(targetKey, oldData => {
        if (!oldData) {
          return oldData;
        }

        return {
          ...oldData,
          data: {
            ...oldData.data,
            results: oldData.data.results.map(comment =>
              comment.commentNo === -1 ? newComment : comment
            ),
          },
        };
      }),
    onSettled: () => {
      /* [onSettled] 댓글 목록 무효화 */
      void queryClient.invalidateQueries({
        queryKey: QueryKeyFactory.comment.lists(postNo),
      });

      /* [onSettled] 게시물 상세 정보도 무효화 (댓글 수 변경) */
      void queryClient.invalidateQueries({
        queryKey: QueryKeyFactory.community.detail(postNo),
      });
    },
  });
};

/**
 * usePutEditCommunityArticleComment
 * - 커뮤니티 게시글 댓글 수정 요청을 담당하는 훅입니다.
 * - 댓글 목록 캐시를 낙관적 업데이트로 동기화하고, 실패 시 스냅샷으로 롤백합니다.
 */
export const usePutEditCommunityArticleComment = () => {
  const { communityPostNo } = useParams();

  const queryClient = useQueryClient();

  const postNo = Number(communityPostNo);

  return useMutation({
    mutationFn: putEditCommunityArticleComment,
    onMutate: async ({ commentNo, content }) => {
      /* [onMutate] 1) 활성 쿼리 취소 */
      await queryClient.cancelQueries({
        queryKey: QueryKeyFactory.comment.lists(postNo),
      });

      /* [onMutate] 2) 스냅샷 저장: 댓글 */
      const commentQueries = queryClient.getQueriesData({
        queryKey: QueryKeyFactory.comment.lists(postNo),
      });
      const prevComments = commentQueries.map(
        ([key, data]) => [key, data] as const
      );

      /* [onMutate] 3) 모든 댓글 목록에서 해당 댓글 수정 (낙관적) */
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
                  ? { ...comment, content, updatedAt: new Date().toISOString() }
                  : comment
              ),
            },
          };
        });
      });

      /* [onMutate] 4) 반환: 롤백용 스냅샷 */
      return { prevComments };
    },
    onError: (_err, _variables, context) =>
      /* [onError] 이전 스냅샷으로 정확히 롤백 */
      context?.prevComments.forEach(([key, data]) => {
        queryClient.setQueryData(key, data);
      }),
    onSettled: () =>
      /* [onSettled] 댓글 목록 무효화 */
      queryClient.invalidateQueries({
        queryKey: QueryKeyFactory.comment.lists(postNo),
      }),
  });
};

/**
 * useDeleteCommunityArticleComment
 * - 커뮤니티 게시글 댓글 삭제 요청을 담당하는 훅입니다.
 * - 댓글 목록 캐시를 낙관적 업데이트로 동기화하고, 실패 시 스냅샷으로 롤백합니다.
 */
export const useDeleteCommunityArticleComment = () => {
  const { communityPostNo } = useParams();

  const queryClient = useQueryClient();

  const page = useCommunityArticleCommentPageStore(state => state.page);

  const postNo = Number(communityPostNo);
  const commentKey = QueryKeyFactory.comment.list(postNo, page);
  const communityKey = QueryKeyFactory.community.detail(postNo);

  return useMutation({
    mutationFn: deleteCommunityArticleComment,
    onMutate: async (commentNo: number) => {
      /* [onMutate] 1) 활성 쿼리 취소 */
      await queryClient.cancelQueries({
        queryKey: commentKey,
      });
      await queryClient.cancelQueries({
        queryKey: communityKey,
      });

      /* [onMutate] 2) 스냅샷 저장: 댓글/상세 */
      const prevComments =
        queryClient.getQueryData<
          customAxiosResponseType<paginationType<commentType>>
        >(commentKey);
      const prevDetail =
        queryClient.getQueryData<
          customAxiosResponseType<communityArticleDetailType>
        >(communityKey);

      /* [onMutate] 3) 댓글에 답글이 있는지 확인 */
      const hasReply = prevComments?.data.results.some(
        comment => comment.replyCount > 0 && comment.commentNo === commentNo
      );

      /* [onMutate] 4) 첫 번째 댓글인지 확인 */
      const isFirstComment =
        prevComments?.data.results[0].commentNo === commentNo;

      /* [onMutate] 5) 댓글 목록에서 해당 댓글 삭제 (낙관적) */
      queryClient.setQueryData<
        customAxiosResponseType<paginationType<commentType>>
      >(commentKey, oldData => {
        if (!oldData) {
          return oldData;
        }

        return {
          ...oldData,
          data: {
            ...oldData.data,
            results: hasReply
              ? oldData.data.results.filter(
                  comment => comment.commentNo !== commentNo
                )
              : oldData.data.results.map(comment =>
                  comment.commentNo === commentNo
                    ? { ...comment, isDeleted: true }
                    : comment
                ),
          },
        };
      });

      /* [onMutate] 6) 상세 페이지 댓글 마지막 페이지 업데이트 */
      queryClient.setQueryData<
        customAxiosResponseType<communityArticleDetailType>
      >(communityKey, oldData => {
        if (!oldData) {
          return oldData;
        }

        return {
          ...oldData,
          data: {
            ...oldData.data,
            commentLastPage:
              hasReply || !isFirstComment
                ? oldData.data.commentLastPage
                : oldData.data.commentLastPage - 1,
          },
        };
      });

      /* [onMutate] 7) 반환: 롤백용 스냅샷 */
      return { prevDetail, prevComments };
    },
    onError: (_err, _variables, context) => {
      /* [onError] 이전 스냅샷으로 정확히 롤백 */
      if (context?.prevDetail) {
        queryClient.setQueryData(communityKey, context.prevDetail);
      }

      if (context?.prevComments) {
        queryClient.setQueryData(commentKey, context.prevComments);
      }
    },
    onSettled: () => {
      /* [onSettled] 댓글 목록 무효화 */
      void queryClient.invalidateQueries({
        queryKey: QueryKeyFactory.comment.lists(postNo),
      });

      /* [onSettled] 게시물 상세 정보도 무효화 (댓글 수 변경) */
      void queryClient.invalidateQueries({
        queryKey: QueryKeyFactory.community.detail(postNo),
      });
    },
  });
};
