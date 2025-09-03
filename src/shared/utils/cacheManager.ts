/**
 * 캐시 관리 유틸리티
 * 프로젝트 전반의 캐시 무효화, 낙관적 업데이트, 관계성 관리를 담당
 */

import { QueryClient } from "@tanstack/react-query";

import { createQueryKey } from "@shared/utils/createQueryKey";

import { customAxiosResponseType, paginationType } from "@shared/type/api.type";

/**
 * 캐시 정책 상수
 */
export const CACHE_POLICIES = {
  // 게시물 목록 - 자주 변하므로 짧은 staleTime
  ARTICLE_LIST: {
    staleTime: 30 * 1000, // 30초
    gcTime: 5 * 60 * 1000, // 5분
  },
  // 게시물 상세 - 댓글/좋아요 등이 자주 변하므로 짧은 staleTime
  ARTICLE_DETAIL: {
    staleTime: 1 * 60 * 1000, // 1분
    gcTime: 10 * 60 * 1000, // 10분
  },
  // 댓글 목록 - 실시간성 중요
  COMMENT_LIST: {
    staleTime: 30 * 1000, // 30초
    gcTime: 5 * 60 * 1000, // 5분
  },
  // 답글 목록 - 가장 실시간성 중요한 대화형 컨텐츠
  REPLY_LIST: {
    staleTime: 20 * 1000, // 20초
    gcTime: 3 * 60 * 1000, // 3분
  },
  // 메인 페이지 - 변동성에 따라 차등
  MAIN_PERSONALIZED: {
    staleTime: 3 * 60 * 1000, // 3분 - 개인화된 추천
    gcTime: 15 * 60 * 1000, // 15분
  },
  MAIN_RECENT: {
    staleTime: 2 * 60 * 1000, // 2분 - 최신 글
    gcTime: 10 * 60 * 1000, // 10분
  },
  MAIN_BEST: {
    staleTime: 5 * 60 * 1000, // 5분 - 인기 글
    gcTime: 15 * 60 * 1000, // 15분
  },
  // 사용자 프로필 - 변경 빈도 낮음
  USER_PROFILE: {
    staleTime: 5 * 60 * 1000, // 5분
    gcTime: 60 * 60 * 1000, // 1시간
  },
  // 사용자 작성글 목록 - 변경 빈도 중간
  WRITTEN_LIST: {
    staleTime: 5 * 60 * 1000, // 5분
    gcTime: 15 * 60 * 1000, // 15분
  },
  // 즐겨찾기 목록 - 변경 빈도 중간
  FAVORITE_LIST: {
    staleTime: 5 * 60 * 1000, // 5분
    gcTime: 15 * 60 * 1000, // 15분
  },
  // 이벤트/공지사항 - 변경 빈도 매우 낮음
  EVENT_NOTICE: {
    staleTime: 30 * 60 * 1000, // 30분
    gcTime: 2 * 60 * 60 * 1000, // 2시간
  },

  // 인증 관련 (중복체크, 닉네임 등)
  AUTH_VALIDATION: {
    staleTime: 5 * 60 * 1000, // 5분 (중복체크 결과는 어느정도 유지)
    gcTime: 10 * 60 * 1000, // 10분
  },
} as const;

enum queryKeys {
  USER = "USER",
  MAIN = "MAIN",
  NOTICE = "NOTICE",
  FAVORITE_MATCHING = "FAVORITE_MATCHING",
  WRITTEN_COMMUNITY = "WRITTEN_COMMUNITY",
  WRITTEN_MATCHING = "WRITTEN_MATCHING",
  WRITTEN_COMMENT = "WRITTEN_COMMENT",
  WRITTEN_REPLY = "WRITTEN_REPLY",
  EVENT = "EVENT",
  MATCHING = "MATCHING",
  COMMUNITY = "COMMUNITY",
  COMMUNITY_COMMENT = "COMMUNITY_COMMENT",
  COMMUNITY_REPLY = "COMMUNITY_REPLY",
}

/**
 * 엔티티별 쿼리 키 생성기
 */
export const QueryKeyFactory = {
  // 사용자 관련
  user: {
    all: () => createQueryKey([queryKeys.USER]),
    profile: () =>
      createQueryKey([queryKeys.USER, "profile"], { isLoggedIn: true }),
    activityCounts: () =>
      createQueryKey([queryKeys.USER, "activity-counts"], { isLoggedIn: true }),
    written: {
      all: () => createQueryKey([queryKeys.USER, "written"]),
      community: {
        all: () =>
          createQueryKey([queryKeys.WRITTEN_COMMUNITY], { isList: true }),
        list: (page: number) =>
          createQueryKey([queryKeys.WRITTEN_COMMUNITY, page], { isList: true }),
      },
      matching: {
        all: () =>
          createQueryKey([queryKeys.WRITTEN_MATCHING], { isList: true }),
        list: (page: number) =>
          createQueryKey([queryKeys.WRITTEN_MATCHING, page], { isList: true }),
      },
      comment: {
        all: () =>
          createQueryKey([queryKeys.WRITTEN_COMMENT], { isList: true }),
        list: (page: number) =>
          createQueryKey([queryKeys.WRITTEN_COMMENT, page], { isList: true }),
      },
      reply: {
        all: () => createQueryKey([queryKeys.WRITTEN_REPLY], { isList: true }),
        list: (page: number) =>
          createQueryKey([queryKeys.WRITTEN_REPLY, page], { isList: true }),
      },
    },
    favoriteMatching: {
      all: () =>
        createQueryKey([queryKeys.FAVORITE_MATCHING], { isList: true }),
      list: (page: number) =>
        createQueryKey([queryKeys.FAVORITE_MATCHING, page], { isList: true }),
    },
  },

  // 이벤트/공지사항
  event: {
    all: () => createQueryKey([queryKeys.EVENT]),
    lists: () => createQueryKey([queryKeys.EVENT], { isList: true }),
    list: (filter: Record<string, unknown>) =>
      createQueryKey([queryKeys.EVENT, filter.size, filter.page], {
        isList: true,
      }),
    detail: (id: number) => createQueryKey([queryKeys.EVENT, id]),
  },

  notice: {
    all: () => createQueryKey([queryKeys.NOTICE]),
    lists: () => createQueryKey([queryKeys.NOTICE], { isList: true }),
    list: (filter: Record<string, unknown>) =>
      createQueryKey([queryKeys.NOTICE, filter.size, filter.page], {
        isList: true,
      }),
    detail: (id: number) => createQueryKey([queryKeys.NOTICE, id]),
  },

  /**
   * 인증 관련
   */
  auth: {
    nicknameCheck: (nickname?: string) =>
      createQueryKey(["AUTH", "nicknameCheck", nickname]),
    userIdCheck: (userId?: string) =>
      createQueryKey(["AUTH", "userIdCheck", userId]),
    randomNickname: () => createQueryKey(["AUTH", "randomNickname"]),
  },

  // 매칭 게시물
  matching: {
    all: () => createQueryKey([queryKeys.MATCHING]),
    lists: () => createQueryKey([queryKeys.MATCHING], { isList: true }),
    list: (filter: Record<string, unknown>) =>
      createQueryKey([queryKeys.MATCHING, filter], { isList: true }),
    detail: (id: number) => createQueryKey([queryKeys.MATCHING, id]),
  },

  // 커뮤니티 게시물
  community: {
    all: () => createQueryKey([queryKeys.COMMUNITY]),
    lists: () => createQueryKey([queryKeys.COMMUNITY], { isList: true }),
    list: (filter: Record<string, unknown>) =>
      createQueryKey([queryKeys.COMMUNITY, filter], { isList: true }),
    detail: (id: number) => createQueryKey([queryKeys.COMMUNITY, id]),
  },

  // 댓글
  comments: {
    all: (postId: number) =>
      createQueryKey([queryKeys.COMMUNITY_COMMENT, postId]),
    lists: (postId: number) =>
      createQueryKey([queryKeys.COMMUNITY_COMMENT, postId], { isList: true }),
    list: (postId: number, page: number) =>
      createQueryKey([queryKeys.COMMUNITY_COMMENT, postId, page], {
        isList: true,
      }),
  },

  // 답글
  replies: {
    all: (commentId: number) =>
      createQueryKey([queryKeys.COMMUNITY_REPLY, commentId]),
    lists: (commentId: number) =>
      createQueryKey([queryKeys.COMMUNITY_REPLY, commentId], { isList: true }),
  },

  // 메인 페이지
  main: {
    matchingPersonalized: () =>
      createQueryKey([queryKeys.MAIN, queryKeys.MATCHING], {
        isLoggedIn: true,
        isList: true,
      }),
    matchingRecent: () =>
      createQueryKey([queryKeys.MAIN, queryKeys.MATCHING], { isList: true }),
    communityBest: () =>
      createQueryKey([queryKeys.MAIN, queryKeys.COMMUNITY], { isList: true }),
  },
} as const;

/**
 * 캐시 무효화 관리자
 * 엔티티 간 관계를 고려한 체계적 무효화 수행
 */
export class CacheInvalidationManager {
  constructor(private queryClient: QueryClient) {}

  /**
   * 매칭 게시물 작성/수정/삭제 시 무효화
   */
  async invalidateMatchingArticle(articleId?: number) {
    const promises = [
      // 모든 매칭 게시물 목록 무효화
      this.queryClient.invalidateQueries({
        queryKey: QueryKeyFactory.matching.lists(),
      }),
      // 메인 페이지 매칭 게시물 무효화
      this.queryClient.invalidateQueries({
        queryKey: QueryKeyFactory.main.matchingPersonalized(),
      }),
      this.queryClient.invalidateQueries({
        queryKey: QueryKeyFactory.main.matchingRecent(),
      }),
    ];

    // 특정 게시물인 경우 상세도 무효화
    if (articleId) {
      promises.push(
        this.queryClient.invalidateQueries({
          queryKey: QueryKeyFactory.matching.detail(articleId),
        })
      );
    }

    await Promise.all(promises);
  }

  /**
   * 커뮤니티 게시물 작성/수정/삭제 시 무효화
   */
  async invalidateCommunityArticle(articleId?: number) {
    const promises = [
      // 모든 커뮤니티 게시물 목록 무효화
      this.queryClient.invalidateQueries({
        queryKey: QueryKeyFactory.community.lists(),
      }),
      // 메인 페이지 커뮤니티 게시물 무효화
      this.queryClient.invalidateQueries({
        queryKey: QueryKeyFactory.main.communityBest(),
      }),
    ];

    // 특정 게시물인 경우 상세 및 연관 캐시도 무효화
    if (articleId) {
      promises.push(
        // 게시물 상세 무효화
        this.queryClient.invalidateQueries({
          queryKey: QueryKeyFactory.community.detail(articleId),
        }),
        // 해당 게시물의 모든 댓글 무효화 (게시물 삭제 시)
        this.queryClient.invalidateQueries({
          queryKey: QueryKeyFactory.comments.lists(articleId),
        }),
        // 해당 게시물의 모든 답글도 무효화 (게시물 삭제 시)
        this.queryClient.invalidateQueries({
          queryKey: QueryKeyFactory.comments.all(articleId),
        })
      );
    }

    await Promise.all(promises);
  }

  /**
   * 댓글 작성/수정/삭제 시 무효화
   */
  async invalidateComment(postId: number, commentId?: number) {
    const promises = [
      // 해당 게시물의 모든 댓글 목록 무효화
      this.queryClient.invalidateQueries({
        queryKey: QueryKeyFactory.comments.lists(postId),
      }),
      // 게시물 상세 정보 무효화 (댓글 수 등 업데이트)
      this.queryClient.invalidateQueries({
        queryKey: QueryKeyFactory.community.detail(postId),
      }),
    ];

    // 특정 댓글인 경우 해당 댓글의 모든 답글도 무효화 (댓글 삭제 시 답글도 함께 처리)
    if (commentId) {
      promises.push(
        // 특정 댓글의 답글 목록 무효화
        this.queryClient.invalidateQueries({
          queryKey: QueryKeyFactory.replies.lists(commentId),
        }),
        // 해당 댓글의 모든 답글 관련 캐시 무효화
        this.queryClient.invalidateQueries({
          queryKey: QueryKeyFactory.replies.all(commentId),
        })
      );
    }

    await Promise.all(promises);
  }

  /**
   * 답글 작성/수정/삭제 시 무효화
   */
  async invalidateReply(commentId: number, postId: number) {
    await Promise.all([
      // 해당 댓글의 답글 목록 무효화
      this.queryClient.invalidateQueries({
        queryKey: QueryKeyFactory.replies.lists(commentId),
      }),
      // 댓글 목록 무효화 (답글 수 업데이트)
      this.queryClient.invalidateQueries({
        queryKey: QueryKeyFactory.comments.lists(postId),
      }),
    ]);
  }

  /**
   * 프로필 수정 시 선택적 무효화
   * 기존의 과도한 전체 무효화를 개선
   */
  async invalidateUserProfile() {
    await Promise.all([
      // 프로필 자체
      this.queryClient.invalidateQueries({
        queryKey: QueryKeyFactory.user.profile(),
      }),
      this.queryClient.invalidateQueries({
        queryKey: QueryKeyFactory.user.activityCounts(),
      }),
      // 사용자가 작성한 글들 (프로필 이미지/닉네임 변경 반영)
      this.queryClient.invalidateQueries({
        queryKey: QueryKeyFactory.user.written.community.all(),
      }),
      this.queryClient.invalidateQueries({
        queryKey: QueryKeyFactory.user.written.matching.all(),
      }),
      this.queryClient.invalidateQueries({
        queryKey: QueryKeyFactory.user.written.comment.all(),
      }),
      this.queryClient.invalidateQueries({
        queryKey: QueryKeyFactory.user.written.reply.all(),
      }),
      this.queryClient.invalidateQueries({
        queryKey: QueryKeyFactory.user.favoriteMatching.all(),
      }),
      // 게시물 목록들 (사용자가 작성한 게시물들의 프로필 정보 업데이트)
      this.queryClient.invalidateQueries({
        queryKey: QueryKeyFactory.matching.lists(),
      }),
      this.queryClient.invalidateQueries({
        queryKey: QueryKeyFactory.community.lists(),
      }),
      // 개인화된 메인 페이지
      this.queryClient.invalidateQueries({
        queryKey: QueryKeyFactory.main.matchingPersonalized(),
      }),
    ]);
  }

  /**
   * 알림 관련 실시간 업데이트
   */
  async invalidateNotificationTargets(
    targetType: "comment" | "reply",
    targetNo: number,
    postId?: number
  ) {
    if (targetType === "comment" && postId) {
      await this.invalidateComment(postId);
    } else if (targetType === "reply" && postId) {
      await this.invalidateReply(targetNo, postId);
    }
  }
}

/**
 * 낙관적 업데이트 유틸리티
 */
export class OptimisticUpdateManager {
  constructor(private queryClient: QueryClient) {}

  /**
   * 게시물 목록에 새 아이템 추가 (낙관적)
   */
  addOptimisticArticle<T>(
    queryKey: unknown[],
    newItem: T,
    position: "prepend" | "append" = "prepend"
  ): T[] | undefined {
    const previousData =
      this.queryClient.getQueryData<customAxiosResponseType<paginationType<T>>>(
        queryKey
      );

    if (!previousData) return undefined;

    this.queryClient.setQueryData<customAxiosResponseType<paginationType<T>>>(
      queryKey,
      oldData => {
        if (!oldData) return oldData;

        const newResults =
          position === "prepend"
            ? [newItem, ...oldData.data.results]
            : [...oldData.data.results, newItem];

        return {
          ...oldData,
          data: {
            ...oldData.data,
            results: newResults,
            pagination: {
              ...oldData.data.pagination,
              totalCount: oldData.data.pagination.totalCount + 1,
            },
          },
        };
      }
    );

    return previousData.data.results;
  }

  /**
   * 게시물 목록에서 아이템 제거 (낙관적)
   */
  removeOptimisticArticle<T extends { [K in keyof T]: T[K] }>(
    queryKey: unknown[],
    itemId: number,
    idField: keyof T
  ) {
    const listQueries = this.queryClient.getQueriesData<
      customAxiosResponseType<paginationType<T>>
    >({ queryKey });

    const previousData = listQueries.map(([key, data]) => [key, data] as const);

    listQueries.forEach(([key]) => {
      this.queryClient.setQueryData<customAxiosResponseType<paginationType<T>>>(
        key,
        oldData => {
          if (!oldData) return oldData;

          return {
            ...oldData,
            data: {
              ...oldData.data,
              results: oldData.data.results.filter(
                item => item[idField] !== itemId
              ),
              pagination: {
                ...oldData.data.pagination,
                totalCount: Math.max(0, oldData.data.pagination.totalCount - 1),
              },
            },
          };
        }
      );
    });

    return previousData;
  }

  /**
   * 게시물 목록에서 아이템 업데이트 (낙관적)
   */
  updateOptimisticArticle<T extends { [K in keyof T]: T[K] }>(
    queryKey: unknown[],
    itemId: number,
    idField: keyof T,
    updates: Partial<T>
  ) {
    const listQueries = this.queryClient.getQueriesData<
      customAxiosResponseType<paginationType<T>>
    >({ queryKey });

    const previousData = listQueries.map(([key, data]) => [key, data] as const);

    listQueries.forEach(([key]) => {
      this.queryClient.setQueryData<customAxiosResponseType<paginationType<T>>>(
        key,
        oldData => {
          if (!oldData) return oldData;

          return {
            ...oldData,
            data: {
              ...oldData.data,
              results: oldData.data.results.map(item =>
                item[idField] === itemId ? { ...item, ...updates } : item
              ),
            },
          };
        }
      );
    });

    return previousData;
  }

  /**
   * 스냅샷 롤백 유틸리티
   */
  rollbackToSnapshot<T>(
    snapshots: readonly (readonly [readonly unknown[], T | undefined])[]
  ) {
    snapshots.forEach(([key, data]) => {
      if (data !== undefined) {
        this.queryClient.setQueryData(key as unknown[], data);
      }
    });
  }
}

/**
 * 통합 캐시 관리자 - 싱글톤 패턴
 */
export class CacheManager {
  private static instance: CacheManager | null = null;
  public readonly invalidation: CacheInvalidationManager;
  public readonly optimistic: OptimisticUpdateManager;

  private constructor(private queryClient: QueryClient) {
    this.invalidation = new CacheInvalidationManager(queryClient);
    this.optimistic = new OptimisticUpdateManager(queryClient);
  }

  static getInstance(queryClient?: QueryClient): CacheManager {
    if (!CacheManager.instance) {
      if (!queryClient) {
        throw new Error("QueryClient is required for first initialization");
      }
      CacheManager.instance = new CacheManager(queryClient);
    }
    return CacheManager.instance;
  }

  /**
   * 쿼리 클라이언트 접근자
   */
  get client() {
    return this.queryClient;
  }
}

/**
 * 편의 함수들
 */
export const getCacheManager = (queryClient?: QueryClient) =>
  CacheManager.getInstance(queryClient);
