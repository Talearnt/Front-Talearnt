import { useMutation, useQueryClient } from "@tanstack/react-query";

import { postSignOut } from "@features/auth/auth.api";

import { QueryKeyFactory } from "@shared/cache/queryKeys/queryKeyFactory";

import { useAuthStore } from "@store/user.store";

/**
 * useSignOut
 * - 로그아웃을 수행합니다.
 */
export const useSignOut = () => {
  const queryClient = useQueryClient();

  const setAccessToken = useAuthStore(state => state.setAccessToken);

  return useMutation({
    mutationFn: postSignOut,
    onSuccess: () => {
      /** 사용자 관련 캐시 제거 */
      queryClient.removeQueries({ queryKey: QueryKeyFactory.user.all() });
      /** accessToken 제거 */
      setAccessToken(null);
    },
  });
};
