import { getAPI } from "@shared/utils/apiMethods";

import { accessTokenType } from "@features/auth/signIn/signIn.type";

// 리프레시 토큰을 이용해 액세스 토큰 조회
export const getAccessTokenUseRefreshToken = () =>
  getAPI<accessTokenType>("v1/auth/login/refresh", undefined, {
    withCredentials: true,
  });
