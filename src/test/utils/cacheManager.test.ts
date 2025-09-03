/**
 * 캐시 관리자 단위 테스트
 */

import { QueryClient } from "@tanstack/react-query";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import {
  CACHE_POLICIES,
  CacheManager,
  QueryKeyFactory,
} from "@shared/utils/cacheManager";

import { customAxiosResponseType, paginationType } from "@shared/type/api.type";

// Mock 데이터 타입
interface MockArticle {
  id: number;
  title: string;
  content: string;
}

describe("CacheManager", () => {
  let queryClient: QueryClient;
  let cacheManager: CacheManager;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false },
      },
    });
    cacheManager = CacheManager.getInstance(queryClient);
  });

  afterEach(() => {
    queryClient.clear();
  });

  const mockData: customAxiosResponseType<paginationType<MockArticle>> = {
    data: {
      results: [
        { id: 1, title: "Article 1", content: "Content 1" },
        { id: 2, title: "Article 2", content: "Content 2" },
      ],
      pagination: {
        hasNext: false,
        hasPrevious: false,
        totalPages: 1,
        currentPage: 1,
        totalCount: 2,
        latestCreatedAt: "",
      },
    },
    status: 200,
    errorCode: null,
    errorMessage: null,
    success: true,
  };

  describe("OptimisticUpdateManager", () => {
    beforeEach(() => {
      queryClient.setQueryData(["test-key"], mockData);
    });

    describe("addOptimisticArticle", () => {
      it("should add article to beginning of list", () => {
        const newArticle: MockArticle = {
          id: 3,
          title: "New Article",
          content: "New Content",
        };

        const previous = cacheManager.optimistic.addOptimisticArticle(
          ["test-key"],
          newArticle,
          "prepend"
        );

        const updatedData = queryClient.getQueryData<
          customAxiosResponseType<paginationType<MockArticle>>
        >(["test-key"]);

        expect(previous).toEqual(mockData.data.results);
        expect(updatedData?.data.results).toHaveLength(3);
        expect(updatedData?.data.results[0]).toEqual(newArticle);
        expect(updatedData?.data.pagination.totalCount).toBe(3);
      });

      it("should add article to end of list", () => {
        const newArticle: MockArticle = {
          id: 3,
          title: "New Article",
          content: "New Content",
        };

        cacheManager.optimistic.addOptimisticArticle(
          ["test-key"],
          newArticle,
          "append"
        );

        const updatedData = queryClient.getQueryData<
          customAxiosResponseType<paginationType<MockArticle>>
        >(["test-key"]);

        expect(updatedData?.data.results).toHaveLength(3);
        expect(updatedData?.data.results[2]).toEqual(newArticle);
      });
    });

    describe("removeOptimisticArticle", () => {
      it("should remove article from list", () => {
        const snapshots =
          cacheManager.optimistic.removeOptimisticArticle<MockArticle>(
            ["test-key"],
            1,
            "id"
          );

        const updatedData = queryClient.getQueryData<
          customAxiosResponseType<paginationType<MockArticle>>
        >(["test-key"]);

        expect(snapshots).toHaveLength(1);
        expect(updatedData?.data.results).toHaveLength(1);
        expect(updatedData?.data.results[0].id).toBe(2);
        expect(updatedData?.data.pagination.totalCount).toBe(1);
      });
    });

    describe("updateOptimisticArticle", () => {
      it("should update article in list", () => {
        const updates = { title: "Updated Title" };

        const snapshots =
          cacheManager.optimistic.updateOptimisticArticle<MockArticle>(
            ["test-key"],
            1,
            "id",
            updates
          );

        const updatedData = queryClient.getQueryData<
          customAxiosResponseType<paginationType<MockArticle>>
        >(["test-key"]);

        expect(snapshots).toHaveLength(1);
        expect(updatedData?.data.results[0].title).toBe("Updated Title");
        expect(updatedData?.data.results[0].content).toBe("Content 1"); // 다른 필드는 변경되지 않음
      });
    });

    describe("rollbackToSnapshot", () => {
      it("should restore data from snapshots", () => {
        // 데이터 수정
        const snapshots =
          cacheManager.optimistic.removeOptimisticArticle<MockArticle>(
            ["test-key"],
            1,
            "id"
          );

        // 롤백
        cacheManager.optimistic.rollbackToSnapshot(snapshots);

        const restoredData = queryClient.getQueryData<
          customAxiosResponseType<paginationType<MockArticle>>
        >(["test-key"]);

        expect(restoredData).toEqual(mockData);
      });
    });
  });

  describe("CacheInvalidationManager", () => {
    beforeEach(() => {
      // 테스트용 데이터 설정
      queryClient.setQueryData(QueryKeyFactory.matching.lists(), mockData);
      queryClient.setQueryData(QueryKeyFactory.community.lists(), mockData);
      queryClient.setQueryData(QueryKeyFactory.main.matchingRecent(), mockData);
      queryClient.setQueryData(QueryKeyFactory.main.communityBest(), mockData);
    });

    describe("invalidateMatchingArticle", () => {
      it("should invalidate all matching article related caches", async () => {
        const invalidateSpy = vi.spyOn(queryClient, "invalidateQueries");

        await cacheManager.invalidation.invalidateMatchingArticle();

        expect(invalidateSpy).toHaveBeenCalledWith({
          queryKey: QueryKeyFactory.matching.lists(),
        });
        expect(invalidateSpy).toHaveBeenCalledWith({
          queryKey: QueryKeyFactory.main.matchingPersonalized(),
        });
        expect(invalidateSpy).toHaveBeenCalledWith({
          queryKey: QueryKeyFactory.main.matchingRecent(),
        });
      });

      it("should invalidate specific article detail when ID provided", async () => {
        const invalidateSpy = vi.spyOn(queryClient, "invalidateQueries");

        await cacheManager.invalidation.invalidateMatchingArticle(123);

        expect(invalidateSpy).toHaveBeenCalledWith({
          queryKey: QueryKeyFactory.matching.detail(123),
        });
      });
    });

    describe("invalidateCommunityArticle", () => {
      it("should invalidate all community article related caches", async () => {
        const invalidateSpy = vi.spyOn(queryClient, "invalidateQueries");

        await cacheManager.invalidation.invalidateCommunityArticle();

        expect(invalidateSpy).toHaveBeenCalledWith({
          queryKey: QueryKeyFactory.community.lists(),
        });
        expect(invalidateSpy).toHaveBeenCalledWith({
          queryKey: QueryKeyFactory.main.communityBest(),
        });
      });
    });

    describe("invalidateComment", () => {
      it("should invalidate comment and related caches", async () => {
        const invalidateSpy = vi.spyOn(queryClient, "invalidateQueries");

        await cacheManager.invalidation.invalidateComment(123, 456);

        expect(invalidateSpy).toHaveBeenCalledWith({
          queryKey: QueryKeyFactory.comments.lists(123),
        });
        expect(invalidateSpy).toHaveBeenCalledWith({
          queryKey: QueryKeyFactory.community.detail(123),
        });
        expect(invalidateSpy).toHaveBeenCalledWith({
          queryKey: QueryKeyFactory.replies.lists(456),
        });
      });
    });
  });

  describe("QueryKeyFactory", () => {
    it("should generate consistent query keys", () => {
      const filter = { page: 1, order: "recent" };

      const matchingListKey = QueryKeyFactory.matching.list(filter);
      const matchingDetailKey = QueryKeyFactory.matching.detail(123);

      expect(matchingListKey).toEqual(
        expect.arrayContaining(["MATCHING", filter])
      );
      expect(matchingDetailKey).toEqual(
        expect.arrayContaining(["MATCHING", 123])
      );
    });

    it("should generate main page keys correctly", () => {
      const personalizedKey = QueryKeyFactory.main.matchingPersonalized();
      const recentKey = QueryKeyFactory.main.matchingRecent();
      const bestKey = QueryKeyFactory.main.communityBest();

      expect(personalizedKey).toEqual(
        expect.arrayContaining(["MAIN", "MATCHING"])
      );
      expect(recentKey).toEqual(expect.arrayContaining(["MAIN", "MATCHING"]));
      expect(bestKey).toEqual(expect.arrayContaining(["MAIN", "COMMUNITY"]));
    });

    it("should generate user-related keys correctly", () => {
      const profileKey = QueryKeyFactory.user.profile();
      const writtenCommunityKey =
        QueryKeyFactory.user.written.community.list(1);
      const favoriteKey = QueryKeyFactory.user.favoriteMatching.list(2);

      expect(profileKey).toEqual(expect.arrayContaining(["USER", "profile"]));
      expect(writtenCommunityKey).toEqual(
        expect.arrayContaining(["WRITTEN_COMMUNITY", 1])
      );
      expect(favoriteKey).toEqual(
        expect.arrayContaining(["FAVORITE_MATCHING", 2])
      );
    });
  });

  describe("CACHE_POLICIES", () => {
    it("should have appropriate cache policies", () => {
      expect(CACHE_POLICIES.ARTICLE_LIST.staleTime).toBe(30 * 1000);
      expect(CACHE_POLICIES.ARTICLE_DETAIL.staleTime).toBe(1 * 60 * 1000);
      expect(CACHE_POLICIES.COMMENT_LIST.staleTime).toBe(30 * 1000);
      expect(CACHE_POLICIES.REPLY_LIST.staleTime).toBe(20 * 1000);

      // staleTime < gcTime 확인
      Object.values(CACHE_POLICIES).forEach(policy => {
        expect(policy.staleTime).toBeLessThan(policy.gcTime);
      });
    });
  });
});
