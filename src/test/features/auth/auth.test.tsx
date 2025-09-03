/**
 * Auth 관련 통합 테스트
 */

import { ReactNode } from "react";
import { BrowserRouter } from "react-router-dom";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import {
  useCheckNickname,
  useCheckUserId,
  useSignIn,
  useSignUp,
  useGetRandomNickname,
} from "@features/auth/auth.hook";

import { QueryKeyFactory, CACHE_POLICIES } from "@shared/utils/cacheManager";

// Mock API 모듈들
vi.mock("@features/auth/signUp/signUp.api", () => ({
  getCheckNickName: vi.fn(),
  getCheckUserId: vi.fn(),
  getRandomNickName: vi.fn(),
  postSignUp: vi.fn(),
}));

vi.mock("@features/auth/signIn/signIn.api", () => ({
  postSignIn: vi.fn(),
}));

vi.mock("@store/user.store", () => ({
  useAuthStore: vi.fn(() => ({
    setAccessToken: vi.fn(),
  })),
}));

vi.mock("@store/toast.store", () => ({
  useToastStore: vi.fn(() => ({
    setToast: vi.fn(),
  })),
}));

vi.mock("@store/prompt.store", () => ({
  usePromptStore: vi.fn(() => ({
    setPrompt: vi.fn(),
  })),
}));

// Mock router
vi.mock("react-router-dom", () => ({
  ...vi.importActual("react-router-dom"),
  useNavigate: () => vi.fn(),
}));

describe("Auth Hooks", () => {
  let queryClient: QueryClient;

  const createWrapper =
    (client: QueryClient) =>
    ({ children }: { children: ReactNode }) => (
      <BrowserRouter>
        <QueryClientProvider client={client}>{children}</QueryClientProvider>
      </BrowserRouter>
    );

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false },
      },
    });
  });

  afterEach(() => {
    queryClient.clear();
    vi.clearAllMocks();
  });

  describe("Validation Hooks", () => {
    it("useCheckNickname should use correct cache settings", () => {
      const wrapper = createWrapper(queryClient);

      renderHook(() => useCheckNickname("testNick", true), { wrapper });

      const queries = queryClient.getQueryCache().getAll();
      const nicknameQuery = queries.find(query =>
        query.queryKey.includes("nicknameCheck")
      );

      expect(nicknameQuery).toBeDefined();
      expect(nicknameQuery?.queryKey).toEqual(
        QueryKeyFactory.auth.nicknameCheck("testNick")
      );
    });

    it("useCheckUserId should use correct cache settings", () => {
      const wrapper = createWrapper(queryClient);

      renderHook(() => useCheckUserId("test@email.com", true), { wrapper });

      const queries = queryClient.getQueryCache().getAll();
      const userIdQuery = queries.find(query =>
        query.queryKey.includes("userIdCheck")
      );

      expect(userIdQuery).toBeDefined();
      expect(userIdQuery?.queryKey).toEqual(
        QueryKeyFactory.auth.userIdCheck("test@email.com")
      );
    });

    it("useGetRandomNickname should fetch random nickname", () => {
      const wrapper = createWrapper(queryClient);

      renderHook(() => useGetRandomNickname(), { wrapper });

      const queries = queryClient.getQueryCache().getAll();
      const randomQuery = queries.find(query =>
        query.queryKey.includes("randomNickname")
      );

      expect(randomQuery).toBeDefined();
    });
  });

  describe("Authentication Mutations", () => {
    it("useSignIn should handle login flow", async () => {
      const wrapper = createWrapper(queryClient);

      const { result } = renderHook(() => useSignIn(), { wrapper });

      expect(result.current.mutate).toBeDefined();
      expect(result.current.isPending).toBe(false);
    });

    it("useSignUp should handle registration flow", async () => {
      const wrapper = createWrapper(queryClient);

      const { result } = renderHook(() => useSignUp(), { wrapper });

      expect(result.current.mutate).toBeDefined();
      expect(result.current.isPending).toBe(false);
    });
  });

  describe("Cache Policies", () => {
    it("should apply correct staleTime and gcTime for auth validation", () => {
      expect(CACHE_POLICIES.AUTH_VALIDATION.staleTime).toBe(5 * 60 * 1000); // 5분
      expect(CACHE_POLICIES.AUTH_VALIDATION.gcTime).toBe(10 * 60 * 1000); // 10분
    });
  });

  describe("Query Key Factory", () => {
    it("should generate correct query keys for auth operations", () => {
      expect(QueryKeyFactory.auth.nicknameCheck("test")).toEqual([
        "AUTH",
        "nicknameCheck",
        "test",
      ]);

      expect(QueryKeyFactory.auth.userIdCheck("test@email.com")).toEqual([
        "AUTH",
        "userIdCheck",
        "test@email.com",
      ]);

      expect(QueryKeyFactory.auth.randomNickname()).toEqual([
        "AUTH",
        "randomNickname",
      ]);
    });
  });

  describe("Error Handling", () => {
    it("should handle validation errors gracefully", async () => {
      const wrapper = createWrapper(queryClient);

      // Mock API 에러
      const mockError = new Error("Validation failed");
      require("@features/auth/signUp/signUp.api").getCheckNickName.mockRejectedValue(
        mockError
      );

      const { result } = renderHook(() => useCheckNickname("invalid", true), {
        wrapper,
      });

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });
    });

    it("should handle mutation errors gracefully", async () => {
      const wrapper = createWrapper(queryClient);

      const mockError = {
        errorMessage: "로그인에 실패했습니다.",
        errorCode: "AUTH_001",
      };

      require("@features/auth/signIn/signIn.api").postSignIn.mockRejectedValue(
        mockError
      );

      const { result } = renderHook(() => useSignIn(), { wrapper });

      result.current.mutate({
        userId: "test@email.com",
        pw: "wrongpassword",
        autoLogin: false,
      });

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });
    });
  });
});
