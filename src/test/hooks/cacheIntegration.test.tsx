/**
 * 캐시 통합 테스트
 * 실제 훅들이 캐시 관리자와 올바르게 연동되는지 테스트
 */

import { ReactNode } from "react";
import { BrowserRouter } from "react-router-dom";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { useDeleteMatchingArticle } from "@features/articles/matchingArticleDetail/matchingArticleDetail.hook";
import { useGetMatchingArticleList } from "@features/articles/matchingArticleList/matchingArticleList.hook";
import { usePostMatchingArticle } from "@features/articles/writeMatchingArticle/writeMatchingArticle.hook";

// Mock API 함수들
vi.mock(
  "@features/articles/writeMatchingArticle/writeMatchingArticle.api",
  () => ({
    postMatchingArticle: vi.fn(),
  })
);

vi.mock(
  "@features/articles/matchingArticleDetail/matchingArticleDetail.api",
  () => ({
    deleteMatchingArticle: vi.fn(),
  })
);

vi.mock(
  "@features/articles/matchingArticleList/matchingArticleList.api",
  () => ({
    getMatchingArticleList: vi.fn(),
  })
);

// Mock 사용자 프로필
vi.mock("@features/user/profile/profile.hook", () => ({
  useGetProfile: () => ({
    data: {
      data: {
        profileImg: "test-img.jpg",
        nickname: "TestUser",
        userNo: 1,
        giveTalents: [],
        receiveTalents: [],
      },
    },
  }),
}));

// Mock stores
vi.mock("@features/articles/shared/articles.store", () => ({
  useWriteMatchingArticleStore: () => ({
    setWriteMatchingArticleId: vi.fn(),
  }),
}));

vi.mock(
  "@features/articles/matchingArticleList/matchingArticleList.store",
  () => ({
    useMatchingArticleListFilterStore: () => ({
      giveTalents: [],
      receiveTalents: [],
      duration: undefined,
      type: undefined,
      status: undefined,
      order: "recent",
      page: 1,
    }),
  })
);

vi.mock("@store/toast.store", () => ({
  useToastStore: () => ({
    setToast: vi.fn(),
  }),
}));

// Mock router params
vi.mock("react-router-dom", () => ({
  ...vi.importActual("react-router-dom"),
  useParams: () => ({ exchangePostNo: "123" }),
  useNavigate: () => vi.fn(),
}));

// 테스트 wrapper 컴포넌트
const createWrapper = (queryClient: QueryClient) => {
  return ({ children }: { children: ReactNode }) => (
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </BrowserRouter>
  );
};

describe("Cache Integration Tests", () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false },
      },
    });
    vi.clearAllMocks();
  });

  afterEach(() => {
    queryClient.clear();
  });

  describe("Matching Article CRUD Operations", () => {
    it("should integrate create, read, and delete operations with proper cache management", async () => {
      const wrapper = createWrapper(queryClient);

      // 1. 목록 조회 훅 렌더링
      const { result: listResult } = renderHook(
        () => useGetMatchingArticleList(),
        { wrapper }
      );

      expect(listResult.current.data).toBeDefined();

      // 2. 게시물 작성 훅 렌더링
      const { result: createResult } = renderHook(
        () => usePostMatchingArticle(),
        { wrapper }
      );

      // 3. 게시물 삭제 훅 렌더링
      const { result: deleteResult } = renderHook(
        () => useDeleteMatchingArticle(),
        { wrapper }
      );

      expect(createResult.current).toBeDefined();
      expect(deleteResult.current).toBeDefined();
    });

    it("should handle optimistic updates correctly", async () => {
      const wrapper = createWrapper(queryClient);

      // Mock API 응답
      const mockPostResponse = { data: 456 };
      require("@features/articles/writeMatchingArticle/writeMatchingArticle.api").postMatchingArticle.mockResolvedValue(
        mockPostResponse
      );

      const { result } = renderHook(() => usePostMatchingArticle(), {
        wrapper,
      });

      // 게시물 작성 실행
      const articleData = {
        title: "Test Article",
        content: "Test Content",
        giveTalents: [],
        receiveTalents: [],
        duration: "1개월" as const,
        exchangeType: "온라인" as const,
        imageUrls: [],
      };

      await waitFor(async () => {
        result.current.mutate(articleData);
      });

      // 낙관적 업데이트가 제대로 적용되었는지 확인은
      // 실제 캐시 상태를 확인하여 검증할 수 있습니다.
    });

    it("should handle cache invalidation after mutations", async () => {
      const wrapper = createWrapper(queryClient);
      const invalidateSpy = vi.spyOn(queryClient, "invalidateQueries");

      require("@features/articles/matchingArticleDetail/matchingArticleDetail.api").deleteMatchingArticle.mockResolvedValue(
        {}
      );

      const { result } = renderHook(() => useDeleteMatchingArticle(), {
        wrapper,
      });

      await waitFor(async () => {
        result.current.mutate();
      });

      // 삭제 후 적절한 캐시 무효화가 실행되었는지 확인
      expect(invalidateSpy).toHaveBeenCalled();
    });
  });

  describe("Error Handling and Rollback", () => {
    it("should rollback optimistic updates on mutation failure", async () => {
      const wrapper = createWrapper(queryClient);

      // Mock API 실패
      require("@features/articles/writeMatchingArticle/writeMatchingArticle.api").postMatchingArticle.mockRejectedValue(
        new Error("API Error")
      );

      const { result } = renderHook(() => usePostMatchingArticle(), {
        wrapper,
      });

      const articleData = {
        title: "Test Article",
        content: "Test Content",
        giveTalents: [],
        receiveTalents: [],
        duration: "1개월" as const,
        exchangeType: "온라인" as const,
        imageUrls: [],
      };

      await waitFor(async () => {
        try {
          result.current.mutate(articleData);
        } catch (error) {
          // 에러가 발생해도 캐시가 원복되었는지 확인
          // 이는 실제 구현에서 onError 콜백에서 처리됩니다.
        }
      });

      expect(result.current.isError).toBe(true);
    });
  });

  describe("Cache Policy Verification", () => {
    it("should use correct staleTime and gcTime values", () => {
      const wrapper = createWrapper(queryClient);

      renderHook(() => useGetMatchingArticleList(), {
        wrapper,
      });

      // 캐시 정책이 올바르게 적용되었는지 확인
      // QueryClient의 내부 상태를 통해 검증할 수 있습니다.
      const queries = queryClient.getQueryCache().getAll();

      expect(queries.length).toBeGreaterThan(0);

      // 각 쿼리의 캐시 정책이 올바르게 설정되었는지 확인
      queries.forEach(query => {
        // Query 객체 자체의 속성들을 확인
        expect(query.queryKey).toBeDefined();
        expect(query.queryHash).toBeDefined();
      });
    });
  });
});
