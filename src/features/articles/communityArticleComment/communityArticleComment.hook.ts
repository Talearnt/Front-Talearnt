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
import { useToastStore } from "@store/toast.store";

import { communityArticleDetailType } from "@features/articles/communityArticleDetail/communityArticleDetail.type";
import { commentType } from "@features/articles/shared/articles.type";
import { activityCountsType } from "@features/user/profile/profile.type";
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
  const detailQueryKey = QueryKeyFactory.community.detail(postNo);
  const listQueryKey = QueryKeyFactory.comment.lists(postNo);

  return useMutation({
    mutationFn: (content: string) =>
      postCommunityArticleComment({ communityPostNo: postNo, content }),
    onMutate: async (content: string) => {
      /**
       * [onMutate] 낙관적 업데이트
       *
       * 즉각 반응: 사용자가 작성한 댓글을 즉시 UI에 표시
       * 동시성: onSettled에서 refetch하여 다른 사용자의 댓글도 반영
       */

      /* 1) 활성 쿼리 취소 */
      await queryClient.cancelQueries({
        queryKey: listQueryKey,
      });
      await queryClient.cancelQueries({
        queryKey: detailQueryKey,
      });

      /* 2) 스냅샷 저장 (롤백용) */
      const prevDetail = queryClient.getQueryData(detailQueryKey);
      const commentQueries = queryClient.getQueriesData({
        queryKey: listQueryKey,
      });
      const prevComments = commentQueries.map(
        ([key, data]) => [key, data] as const
      );

      /* 3) 마지막 페이지 확인 (30개 가득 찬 경우 새 페이지 생성) */
      const lastPageData = queryClient.getQueryData<
        customAxiosResponseType<paginationType<commentType>>
      >(QueryKeyFactory.comment.list(postNo, commentLastPage || 1));

      const targetPage =
        lastPageData && lastPageData.data.results.length >= 30
          ? (commentLastPage || 1) + 1
          : commentLastPage || 1;

      /* 4) 상세 페이지 commentLastPage 업데이트 */
      queryClient.setQueryData<
        customAxiosResponseType<communityArticleDetailType>
      >(detailQueryKey, oldData => {
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

      /* 5) 임시 댓글 추가 (ID: -1) */
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

      return { prevDetail, prevComments };
    },
    onError: (_err, _variables, context) => {
      /* [onError] 실패 시 롤백 */
      if (context?.prevDetail) {
        queryClient.setQueryData(detailQueryKey, context.prevDetail);
      }

      context?.prevComments.forEach(([key, data]) => {
        queryClient.setQueryData(key, data);
      });
    },
    onSuccess: () =>
      /* activityCounts 업데이트 */
      queryClient.setQueryData<customAxiosResponseType<activityCountsType>>(
        QueryKeyFactory.user.activityCounts(),
        oldData => {
          if (!oldData) {
            return oldData;
          }

          return {
            ...oldData,
            data: {
              ...oldData.data,
              myCommentCount: oldData.data.myCommentCount + 1,
            },
          };
        }
      ),
    onSettled: () => {
      /**
       * [onSettled] 동시성을 고려한 refetch 전략
       *
       * ✅ 댓글 목록: 작성 중 다른 사용자가 작성한 댓글도 함께 가져오기 위해 refetch
       * ✅ 상세 페이지: 서버의 정확한 댓글 수 확인
       * ✅ 내가 작성한 댓글 목록: 최신순 정렬 보장
       *
       * [중요] 낙관적 업데이트만으로는 동시성 문제 발생:
       * 내가 댓글 작성 중에 다른 사람이 작성한 댓글을 놓칠 수 있음
       */

      /* 댓글 목록 refetch (다른 사용자의 댓글도 반영) */
      void queryClient.invalidateQueries({
        queryKey: QueryKeyFactory.comment.lists(postNo),
      });

      /* 게시물 상세 정보 무효화 (서버의 정확한 댓글 수 확인) */
      void queryClient.invalidateQueries({
        queryKey: QueryKeyFactory.community.detail(postNo),
      });

      /* 내가 작성한 댓글 목록 refetch (최신순 정렬 보장) */
      void queryClient.invalidateQueries({
        predicate: ({ queryKey }) =>
          QueryKeyFactory.user.written.comment
            .all()
            .every(key => queryKey.includes(key)),
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

  const page = useCommunityArticleCommentPageStore(state => state.page);

  const postNo = Number(communityPostNo);
  const commentKey = QueryKeyFactory.comment.list(postNo, page);

  return useMutation({
    mutationFn: putEditCommunityArticleComment,
    onMutate: async ({ commentNo, content }) => {
      /**
       * [onMutate] 낙관적 업데이트
       *
       * 즉각 반응: 수정된 내용을 즉시 UI에 표시
       * 동시성: 수정은 내 글만 영향, onSettled refetch로 추가 보장
       */

      /* 1) 활성 쿼리 취소 */
      await queryClient.cancelQueries({
        queryKey: commentKey,
      });

      /* 2) 스냅샷 저장 (롤백용) */
      const prevComments = queryClient.getQueryData(commentKey);

      /* 3) 댓글 내용 즉시 업데이트 */
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
            results: oldData.data.results.map(comment =>
              comment.commentNo === commentNo
                ? { ...comment, content, updatedAt: new Date().toISOString() }
                : comment
            ),
          },
        };
      });

      return { prevComments };
    },
    onError: (_err, _variables, context) => {
      /* [onError] 실패 시 롤백 */
      if (context?.prevComments) {
        queryClient.setQueryData(commentKey, context.prevComments);
      }
    },
    onSettled: () => {
      /**
       * [onSettled] refetch로 최종 확인
       *
       * 수정 중 다른 변경사항도 함께 반영
       */
      void queryClient.invalidateQueries({
        queryKey: commentKey,
      });
    },
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
  const setToast = useToastStore(state => state.setToast);

  const postNo = Number(communityPostNo);
  const commentKey = QueryKeyFactory.comment.list(postNo, page);
  const detailQueryKey = QueryKeyFactory.community.detail(postNo);

  return useMutation({
    mutationFn: deleteCommunityArticleComment,
    onMutate: async (commentNo: number) => {
      /**
       * [onMutate] 낙관적 업데이트
       *
       * 즉각 반응: 삭제된 댓글을 즉시 UI에서 제거/표시
       * 동시성: onSettled에서 refetch하여 다른 사용자의 댓글도 반영
       */

      /* 1) 활성 쿼리 취소 */
      await queryClient.cancelQueries({
        queryKey: commentKey,
      });
      await queryClient.cancelQueries({
        queryKey: detailQueryKey,
      });

      /* 2) 스냅샷 저장 (롤백용) */
      const prevComments =
        queryClient.getQueryData<
          customAxiosResponseType<paginationType<commentType>>
        >(commentKey);
      const prevDetail =
        queryClient.getQueryData<
          customAxiosResponseType<communityArticleDetailType>
        >(detailQueryKey);

      /* 3) 답글 유무 확인 (답글 있으면 필터링, 없으면 isDeleted 표시) */
      const hasReply = prevComments?.data.results.some(
        comment => comment.replyCount > 0 && comment.commentNo === commentNo
      );

      /* 4) 첫 번째 댓글 확인 (페이지 조정용) */
      const isFirstComment =
        prevComments?.data.results[0].commentNo === commentNo;

      /* 5) 댓글 삭제 처리 */
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

      /* 6) 상세 페이지 commentLastPage 업데이트 */
      queryClient.setQueryData<
        customAxiosResponseType<communityArticleDetailType>
      >(detailQueryKey, oldData => {
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

      return { prevDetail, prevComments };
    },
    onError: (_err, _variables, context) => {
      /* [onError] 실패 시 롤백 */
      if (context?.prevDetail) {
        queryClient.setQueryData(detailQueryKey, context.prevDetail);
      }

      if (context?.prevComments) {
        queryClient.setQueryData(commentKey, context.prevComments);
      }
    },
    onSuccess: () => {
      setToast({ message: "댓글이 삭제되었습니다" });

      /* [onSuccess] 활동 counts 업데이트 */
      queryClient.setQueryData<customAxiosResponseType<activityCountsType>>(
        QueryKeyFactory.user.activityCounts(),
        oldData => {
          if (!oldData) {
            return oldData;
          }

          return {
            ...oldData,
            data: {
              ...oldData.data,
              myCommentCount: Math.max(0, oldData.data.myCommentCount - 1),
            },
          };
        }
      );
    },
    onSettled: () => {
      /**
       * [onSettled] 동시성을 고려한 선택적 refetch
       *
       * ✅ 댓글 목록: 삭제 중 다른 사용자가 작성한 댓글도 함께 가져오기 (안전한 방식)
       * ✅ 상세 페이지: 서버의 정확한 댓글 수 확인
       * ✅ 내가 작성한 댓글 목록: 삭제된 항목 제거 확인
       *
       * [참고] 낙관적 업데이트만으로도 충분하지만, refetch로 완전한 동기화 보장
       */

      /* 댓글 목록 refetch (삭제 중 작성된 다른 댓글도 반영) */
      void queryClient.invalidateQueries({
        queryKey: QueryKeyFactory.comment.lists(postNo),
      });

      /* 게시물 상세 정보 무효화 (서버의 정확한 댓글 수 확인) */
      void queryClient.invalidateQueries({
        queryKey: QueryKeyFactory.community.detail(postNo),
      });

      /* 내가 작성한 댓글 목록 refetch */
      void queryClient.invalidateQueries({
        predicate: ({ queryKey }) =>
          QueryKeyFactory.user.written.comment
            .all()
            .every(key => queryKey.includes(key)),
      });
    },
  });
};
