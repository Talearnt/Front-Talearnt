import { useNavigate } from "react-router-dom";

import { useMutation } from "@tanstack/react-query";

import { postWithdrawAccount } from "@features/user/withdrawAccount/withdrawAccount.api";

/**
 * useWithdrawAccount
 * - 회원 탈퇴를 수행합니다.
 * - 성공 시 onSuccess 콜백에서 추가 처리를 수행할 수 있습니다.
 */
export const useWithdrawAccount = () => {
  const navigator = useNavigate();

  return useMutation({
    mutationFn: postWithdrawAccount,
    onSuccess: () =>
      /** 탈퇴 완료 페이지로 이동 */
      navigator("/withdrawal-complete"),
  });
};
