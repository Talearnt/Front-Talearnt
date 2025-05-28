// 로그인
import { getAPI, postAPI } from "@shared/utils/apiMethods";

import {
  accessTokenType,
  signInBodyType
} from "@features/auth/signIn/signIn.type";
import { signUpBodyType } from "@features/auth/signUp/signUp.type";

export const postSignIn = (account: signInBodyType) =>
  postAPI<accessTokenType>("/v1/auth/login", account, {
    withCredentials: true
  });

// 카카오 로그인
export const getKakaoAccessToken = (code: string) =>
  getAPI<
    Pick<signUpBodyType, "gender" | "name" | "phone" | "userId"> & {
      accessToken: string;
      isRegistered: boolean;
    }
  >(
    "/v1/auth/login/kakao",
    { code },
    {
      withCredentials: true
    }
  );
