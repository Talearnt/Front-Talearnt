import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useShallow } from "zustand/shallow";

import { postSignOut } from "@features/auth/auth.api";

import { QueryKeyFactory } from "@shared/cache/queryKeys/queryKeyFactory";

import { useAuthStore } from "@store/user.store";

/**
 * useSignOut
 * - 로그아웃을 수행합니다.
 */
export const useSignOut = () => {
  const queryClient = useQueryClient();

  const { setAccessToken, setLogoutRedirect } = useAuthStore(
    useShallow(state => ({
      setAccessToken: state.setAccessToken,
      setLogoutRedirect: state.setLogoutRedirect,
    }))
  );

  return useMutation({
    mutationFn: postSignOut,
    onSuccess: () => {
      /** 로그아웃 후 홈으로 이동은 PrivateRoute에서 처리 */
      setLogoutRedirect({ path: "/" });
      /** 사용자 관련 캐시 제거 */
      queryClient.removeQueries({ queryKey: QueryKeyFactory.user.all() });
      /** accessToken 제거 */
      setAccessToken(null);
    },
  });
};
