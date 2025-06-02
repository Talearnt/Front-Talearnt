import { getAPI } from "@shared/utils/apiMethods";

import { accessTokenType } from "@features/auth/signIn/signIn.type";
import { profileType } from "@features/user/user.type";

// 프로필 조회
export const getProfile = () =>
  getAPI<profileType>("/v1/users/header/profile", undefined, {
    withCredentials: true,
  });

// 리프레시 토큰을 이용해 액세스 토큰 조회
export const getAccessTokenUseRefreshToken = () =>
  getAPI<accessTokenType>("v1/auth/login/refresh", undefined, {
    withCredentials: true,
  });
