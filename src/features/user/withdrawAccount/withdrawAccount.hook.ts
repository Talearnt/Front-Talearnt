import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useShallow } from "zustand/shallow";

import { postWithdrawAccount } from "@features/user/withdrawAccount/withdrawAccount.api";

import { QueryKeyFactory } from "@shared/cache/queryKeys/queryKeyFactory";

import { useAuthStore } from "@store/user.store";

/**
 * useWithdrawAccount
 * - 회원 탈퇴를 수행합니다.
 */
export const useWithdrawAccount = () => {
  const queryClient = useQueryClient();

  const { setAccessToken, setLogoutRedirect } = useAuthStore(
    useShallow(state => ({
      setAccessToken: state.setAccessToken,
      setLogoutRedirect: state.setLogoutRedirect,
    }))
  );

  return useMutation({
    mutationFn: postWithdrawAccount,
    onSuccess: ({ data }) => {
      /** 회원 탈퇴 완료 페이지로 이동은 PrivateRoute에서 처리 */
      setLogoutRedirect({ path: "/withdrawal-complete", state: data });
      /** 사용자 관련 캐시 제거 */
      queryClient.removeQueries({ queryKey: QueryKeyFactory.user.all() });
      /** accessToken 제거 */
      setAccessToken(null);
    },
  });
};
