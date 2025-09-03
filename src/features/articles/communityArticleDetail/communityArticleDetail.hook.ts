import { useNavigate, useParams } from "react-router-dom";

import type { InfiniteData } from "@tanstack/query-core";
import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import {
  deleteCommunityArticle,
  deleteCommunityArticleComment,
  deleteCommunityArticleReply,
  getCommunityArticleCommentList,
  getCommunityArticleDetail,
  getCommunityArticleReplyList,
  postCommunityArticleComment,
  postCommunityArticleReply,
  putEditCommunityArticleComment,
  putEditCommunityArticleReply,
} from "@features/articles/communityArticleDetail/communityArticleDetail.api";

import {
  CACHE_POLICIES,
  getCacheManager,
  QueryKeyFactory,
} from "@shared/utils/cacheManager";

import { useGetProfile } from "@features/user/profile/profile.hook";
import { useQueryWithInitial } from "@shared/hooks/useQueryWithInitial";

import { useCommunityArticleCommentPageStore } from "@features/articles/communityArticleDetail/communityArticleDetail.store";
import { useToastStore } from "@store/toast.store";

import { communityArticleDetailType } from "@features/articles/communityArticleDetail/communityArticleDetail.type";
import { communityArticleType } from "@features/articles/communityArticleList/communityArticleList.type";
import {
  commentType,
  replyType,
} from "@features/articles/shared/articles.type";
import { customAxiosResponseType, paginationType } from "@shared/type/api.type";

// 커뮤니티 게시글 상세 정보
export const useGetCommunityArticleDetail = () => {
  const { communityPostNo } = useParams();

  const postNo = Number(communityPostNo);

  // 상세 조회
  // - 커뮤니티 글은 댓글/좋아요 등이 자주 변경되므로 짧은 staleTime 적용
  // - 초기 데이터로 첫 렌더 깜빡임을 줄입니다
  return useQueryWithInitial(
    {
      commentLastPage: 0,
      communityPostNo: 0,
      content: "",
      count: 0,
      createdAt: "",
      imageUrls: [],
      isLike: false,
      likeCount: 0,
      nickname: "",
      postType: "자유 게시판",
      profileImg: null,
      title: "",
      updatedAt: "",
      userNo: 0,
    },
    {
      queryKey: QueryKeyFactory.community.detail(postNo),
      queryFn: () => getCommunityArticleDetail(postNo),
      enabled: communityPostNo !== undefined,
      staleTime: CACHE_POLICIES.ARTICLE_DETAIL.staleTime,
      gcTime: CACHE_POLICIES.ARTICLE_DETAIL.gcTime,
    }
  );
};

// 커뮤니티 게시글 제거
export const useDeleteCommunityArticle = () => {
  const { communityPostNo } = useParams();
  const navigator = useNavigate();

  const queryClient = useQueryClient();

  const setToast = useToastStore(state => state.setToast);

  const postNo = Number(communityPostNo);

  // 삭제 낙관적 업데이트 흐름 - 새로운 캐시 관리자 사용
  return useMutation({
    mutationFn: () => deleteCommunityArticle(postNo),
    onMutate: async () => {
      const cacheManager = getCacheManager(queryClient);

      // 1) 활성 쿼리 취소
      await queryClient.cancelQueries({
        queryKey: QueryKeyFactory.community.all(),
      });

      // 2) 스냅샷 저장 및 3) 낙관적 제거
      const prevDetail = queryClient.getQueryData(
        QueryKeyFactory.community.detail(postNo)
      );

      const prevLists =
        cacheManager.optimistic.removeOptimisticArticle<communityArticleType>(
          QueryKeyFactory.community.lists(),
          postNo,
          "communityPostNo"
        );

      // 3-a) 상세 캐시 제거(삭제 후 상세 접근 방지)
      queryClient.removeQueries({
        queryKey: QueryKeyFactory.community.detail(postNo),
      });

      return { prevDetail, prevLists };
    },
    onError: (_err, _variables, context) => {
      const cacheManager = getCacheManager(queryClient);

      // 실패 시 상세/리스트 모두 정확히 원복
      if (context?.prevDetail) {
        queryClient.setQueryData(
          QueryKeyFactory.community.detail(postNo),
          context.prevDetail
        );
      }

      if (context?.prevLists) {
        cacheManager.optimistic.rollbackToSnapshot(context.prevLists);
      }
    },
    onSuccess: () => {
      // 사용자 피드백 + 목록으로 이동
      setToast({ message: "게시물이 삭제되었습니다" });
      navigator("/community");
    },
    onSettled: async () => {
      const cacheManager = getCacheManager(queryClient);
      await cacheManager.invalidation.invalidateCommunityArticle(postNo);
    },
  });
};

// ***********************
// 댓글 관련 hook
// ***********************
// 커뮤니티 게시글 댓글 작성
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
    // onMutate: 댓글 작성 전 낙관적 업데이트 수행
    onMutate: async (content: string) => {
      // 활성 쿼리 취소
      await queryClient.cancelQueries({
        queryKey: QueryKeyFactory.comments.lists(postNo),
      });
      await queryClient.cancelQueries({
        queryKey: QueryKeyFactory.community.detail(postNo),
      });

      // 스냅샷 저장
      const prevDetail = queryClient.getQueryData<
        customAxiosResponseType<communityArticleDetailType>
      >(QueryKeyFactory.community.detail(postNo));
      const commentQueries = queryClient.getQueriesData({
        queryKey: QueryKeyFactory.comments.lists(postNo),
      });
      const prevComments = commentQueries.map(
        ([key, data]) => [key, data] as const
      );

      // 마지막 페이지가 가득 찬 경우 다음 페이지 확인
      const lastPageKey = QueryKeyFactory.comments.list(
        postNo,
        commentLastPage || 1
      );
      const lastPageData =
        queryClient.getQueryData<
          customAxiosResponseType<paginationType<commentType>>
        >(lastPageKey);

      // 마지막 페이지가 30개로 가득 찬 경우 새 페이지에 추가
      const targetPage =
        lastPageData && lastPageData.data.results.length >= 30
          ? (commentLastPage || 1) + 1
          : commentLastPage || 1;

      const targetKey = QueryKeyFactory.comments.list(postNo, targetPage);

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

      return { prevDetail, prevComments, targetPage };
    },
    // onError: 실패 시 스냅샷으로 롤백
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
    // onSuccess: 서버 응답으로 정확한 데이터 저장 + 상세 페이지 댓글 마지막 페이지 업데이트
    onSuccess: ({ data: newComment }, _variables, context) => {
      // 새 댓글이 추가된 페이지를 찾아서 임시 댓글을 실제 댓글로 교체
      const commentQueries = queryClient.getQueriesData({
        queryKey: QueryKeyFactory.comments.lists(postNo),
      });

      // 임시 댓글(-1)을 실제 댓글로 교체
      commentQueries.forEach(([key]) => {
        queryClient.setQueryData<
          customAxiosResponseType<paginationType<commentType>>
        >(key, oldData => {
          if (!oldData) {
            return oldData;
          }

          const hasOptimisticComment = oldData.data.results.some(
            comment => comment.commentNo === -1
          );

          if (hasOptimisticComment) {
            return {
              ...oldData,
              data: {
                ...oldData.data,
                results: oldData.data.results.map(comment =>
                  comment.commentNo === -1 ? newComment : comment
                ),
              },
            };
          }

          return oldData;
        });
      });

      // 상세 페이지의 댓글 마지막 페이지 정보 업데이트
      if (context.targetPage) {
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
              commentLastPage: context.targetPage,
            },
          };
        });
      }
    },
    // onSettled: 최종 재검증
    onSettled: async () => {
      const cacheManager = getCacheManager(queryClient);
      await cacheManager.invalidation.invalidateComment(postNo);
    },
  });
};

// 커뮤니티 게시글 댓글 리스트
export const useGetCommunityArticleCommentList = () => {
  const { communityPostNo } = useParams();

  const page = useCommunityArticleCommentPageStore(state => state.page);

  const postNo = Number(communityPostNo);

  // 댓글 목록 조회
  // - 댓글은 실시간성이 중요하므로 짧은 staleTime 적용
  // - 페이지네이션을 고려한 적절한 gcTime 설정
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
      queryKey: QueryKeyFactory.comments.list(postNo, page),
      queryFn: () =>
        getCommunityArticleCommentList({
          communityPostNo: postNo,
          page,
        }),
      enabled: communityPostNo !== undefined && page !== 0,
      staleTime: CACHE_POLICIES.COMMENT_LIST.staleTime,
      gcTime: CACHE_POLICIES.COMMENT_LIST.gcTime,
    },
    QueryKeyFactory.comments.lists(postNo)
  );
};

// 커뮤니티 게시글 댓글 수정
export const usePutEditCommunityArticleComment = () => {
  const { communityPostNo } = useParams();

  const queryClient = useQueryClient();

  const postNo = Number(communityPostNo);

  return useMutation({
    mutationFn: putEditCommunityArticleComment,
    // onMutate: 수정 전 낙관적 업데이트
    onMutate: async ({ commentNo, content }) => {
      // 활성 쿼리 취소
      await queryClient.cancelQueries({
        queryKey: QueryKeyFactory.comments.lists(postNo),
      });

      // 스냅샷 저장
      const commentQueries = queryClient.getQueriesData({
        queryKey: QueryKeyFactory.comments.lists(postNo),
      });
      const prevComments = commentQueries.map(
        ([key, data]) => [key, data] as const
      );

      // 모든 댓글 목록에서 해당 댓글 수정 (낙관적)
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

      return { prevComments };
    },
    // onError: 실패 시 롤백
    onError: (_err, _variables, context) =>
      context?.prevComments.forEach(([key, data]) => {
        queryClient.setQueryData(key, data);
      }),
    // onSettled: 최종 재검증
    onSettled: async () => {
      const cacheManager = getCacheManager(queryClient);
      await cacheManager.invalidation.invalidateComment(postNo);
    },
  });
};

// 커뮤니티 게시글 댓글 삭제
export const useDeleteCommunityArticleComment = () => {
  const { communityPostNo } = useParams();

  const queryClient = useQueryClient();

  const page = useCommunityArticleCommentPageStore(state => state.page);

  const postNo = Number(communityPostNo);
  const commentKey = QueryKeyFactory.comments.list(postNo, page);
  const communityKey = QueryKeyFactory.community.detail(postNo);

  return useMutation({
    mutationFn: deleteCommunityArticleComment,
    // onMutate: 삭제 전 낙관적 업데이트 + 연관 캐시 처리
    onMutate: async (commentNo: number) => {
      // 활성 쿼리 취소
      await queryClient.cancelQueries({
        queryKey: commentKey,
      });
      await queryClient.cancelQueries({
        queryKey: communityKey,
      });

      // 스냅샷 저장
      const prevComments =
        queryClient.getQueryData<
          customAxiosResponseType<paginationType<commentType>>
        >(commentKey);
      const prevDetail =
        queryClient.getQueryData<
          customAxiosResponseType<communityArticleDetailType>
        >(communityKey);
      const hasReply = prevComments?.data.results.some(
        comment => comment.replyCount > 0 && comment.commentNo === commentNo
      );
      const isFirstComment =
        prevComments?.data.results[0].commentNo === commentNo;

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

      return { prevDetail, prevComments };
    },
    // onError: 실패 시 롤백
    onError: (_err, _variables, context) => {
      if (context?.prevDetail) {
        queryClient.setQueryData(communityKey, context.prevDetail);
      }

      if (context?.prevComments) {
        queryClient.setQueryData(commentKey, context.prevComments);
      }
    },
    onSettled: async () => {
      const cacheManager = getCacheManager(queryClient);
      await cacheManager.invalidation.invalidateComment(postNo);
    },
  });
};

// ***********************
// 답글 관련 hook
// ***********************
// 커뮤니티 게시글 답글 작성
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
    // onMutate: 답글 작성 전 낙관적 업데이트 + 댓글 답글 수 증가
    onMutate: async (content: string) => {
      // 활성 쿼리 취소
      await queryClient.cancelQueries({
        queryKey: QueryKeyFactory.comments.lists(postNo),
      });

      // 답글이 열려있는 경우에만 답글 목록 쿼리 취소
      if (isOpen) {
        await queryClient.cancelQueries({
          queryKey: QueryKeyFactory.replies.lists(commentNo),
        });
      }

      // 스냅샷 저장
      const prevReplies = isOpen
        ? queryClient.getQueryData<
            InfiniteData<customAxiosResponseType<paginationType<replyType>>>
          >(QueryKeyFactory.replies.lists(commentNo))
        : undefined;

      const commentQueries = queryClient.getQueriesData({
        queryKey: QueryKeyFactory.comments.lists(postNo),
      });
      const prevComments = commentQueries.map(
        ([key, data]) => [key, data] as const
      );

      // 답글이 열려있는 경우에만 답글 목록에 임시 답글 추가 (낙관적)
      if (isOpen) {
        queryClient.setQueryData<
          InfiniteData<customAxiosResponseType<paginationType<replyType>>>
        >(QueryKeyFactory.replies.lists(commentNo), oldData => {
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

      // 댓글의 답글 수는 항상 증가 (답글이 열려있지 않아도 답글 수는 보여지므로)
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
    // onError: 실패 시 롤백
    onError: (_err, _variables, context) => {
      if (context?.prevReplies) {
        queryClient.setQueryData(
          QueryKeyFactory.replies.lists(commentNo),
          context.prevReplies
        );
      }

      context?.prevComments.forEach(([key, data]) => {
        queryClient.setQueryData(key, data);
      });
    },
    // onSuccess: 서버 응답으로 정확한 데이터 저장
    onSuccess: ({ data: reply }) => {
      if (isOpen) {
        // 답글 목록 정규화 (마지막 페이지에 실제 답글로 교체)
        queryClient.setQueryData<
          InfiniteData<customAxiosResponseType<paginationType<replyType>>>
        >(QueryKeyFactory.replies.lists(commentNo), oldData => {
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
    // onSettled: 최종 재검증
    onSettled: async () => {
      const cacheManager = getCacheManager(queryClient);
      await cacheManager.invalidation.invalidateReply(commentNo, postNo);
    },
  });
};

// 커뮤니티 게시글 답글 리스트
export const useGetCommunityArticleReplyList = (
  commentNo: number,
  enabled: boolean
) =>
  useInfiniteQuery<
    customAxiosResponseType<paginationType<replyType>>, // queryFn 타입
    Error, // error 타입
    replyType[], // select 타입
    unknown[], // queryKey 타입
    number | undefined // pageParam 타입
  >({
    enabled,
    queryKey: QueryKeyFactory.replies.lists(commentNo),
    queryFn: ({ pageParam }) =>
      getCommunityArticleReplyList({ commentNo, lastNo: pageParam }),
    getPreviousPageParam: lastPage =>
      lastPage.data.pagination.hasNext
        ? lastPage.data.results[0].replyNo
        : undefined,
    getNextPageParam: () => undefined,
    select: data => data.pages.flatMap(page => page.data.results),
    initialPageParam: undefined,
    // 답글 목록 캐시 정책 - 댓글보다 더 실시간성이 중요한 대화형 컨텐츠
    staleTime: CACHE_POLICIES.REPLY_LIST.staleTime,
    gcTime: CACHE_POLICIES.REPLY_LIST.gcTime,
  });

// 커뮤니티 게시글 답글 수정
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
    // onMutate: 수정 전 낙관적 업데이트
    onMutate: async (content: string) => {
      // 활성 쿼리 취소
      await queryClient.cancelQueries({
        queryKey: QueryKeyFactory.replies.lists(commentNo),
      });

      // 스냅샷 저장
      const prevReplies = queryClient.getQueryData<
        InfiniteData<customAxiosResponseType<paginationType<replyType>>>
      >(QueryKeyFactory.replies.lists(commentNo));

      // 답글 목록에서 해당 답글 수정 (낙관적)
      queryClient.setQueryData<
        InfiniteData<customAxiosResponseType<paginationType<replyType>>>
      >(QueryKeyFactory.replies.lists(commentNo), oldData => {
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
    // onError: 실패 시 롤백
    onError: (_err, _variables, context) => {
      if (context?.prevReplies) {
        queryClient.setQueryData(
          QueryKeyFactory.replies.lists(commentNo),
          context.prevReplies
        );
      }
    },
    // onSettled: 최종 재검증
    onSettled: async () => {
      const cacheManager = getCacheManager(queryClient);
      await cacheManager.invalidation.invalidateReply(commentNo, postNo);
    },
  });
};

// 커뮤니티 게시글 답글 삭제
export const useDeleteCommunityArticleReply = (
  commentNo: number,
  replyNo: number
) => {
  const { communityPostNo } = useParams();

  const queryClient = useQueryClient();

  const postNo = Number(communityPostNo);

  return useMutation({
    mutationFn: () => deleteCommunityArticleReply(replyNo),
    // onMutate: 삭제 전 낙관적 업데이트 + 댓글 답글 수 감소
    onMutate: async () => {
      // 활성 쿼리 취소
      await queryClient.cancelQueries({
        queryKey: QueryKeyFactory.replies.lists(commentNo),
      });
      await queryClient.cancelQueries({
        queryKey: QueryKeyFactory.comments.lists(postNo),
      });

      // 스냅샷 저장
      const prevReplies = queryClient.getQueryData<
        InfiniteData<customAxiosResponseType<paginationType<replyType>>>
      >(QueryKeyFactory.replies.lists(commentNo));

      const commentQueries = queryClient.getQueriesData({
        queryKey: QueryKeyFactory.comments.lists(postNo),
      });
      const prevComments = commentQueries.map(
        ([key, data]) => [key, data] as const
      );

      // 답글 목록에서 해당 답글 삭제 표시 (낙관적)
      queryClient.setQueryData<
        InfiniteData<customAxiosResponseType<paginationType<replyType>>>
      >(QueryKeyFactory.replies.lists(commentNo), oldData => {
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

      // 댓글의 답글 수 감소 (낙관적)
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
    // onError: 실패 시 롤백
    onError: (_err, _variables, context) => {
      if (context?.prevReplies) {
        queryClient.setQueryData(
          QueryKeyFactory.replies.lists(commentNo),
          context.prevReplies
        );
      }

      context?.prevComments.forEach(([key, data]) => {
        queryClient.setQueryData(key, data);
      });
    },
    // onSettled: 최종 재검증
    onSettled: async () => {
      const cacheManager = getCacheManager(queryClient);
      await cacheManager.invalidation.invalidateReply(commentNo, postNo);
    },
  });
};
