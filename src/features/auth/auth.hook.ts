import { useNavigate } from "react-router-dom";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { postSignOut } from "@features/auth/auth.api";

import { QueryKeyFactory } from "@shared/cache/queryKeys/queryKeyFactory";

import { useAuthStore } from "@store/user.store";

// 로그아웃
export const useSignOut = () => {
  const navigate = useNavigate();

  const queryClient = useQueryClient();

  const setAccessToken = useAuthStore(state => state.setAccessToken);

  return useMutation({
    mutationFn: postSignOut,
    onSuccess: () => {
      setAccessToken(null);
      queryClient.removeQueries({ queryKey: QueryKeyFactory.user.all() });
      navigate("/");
    },
  });
};
