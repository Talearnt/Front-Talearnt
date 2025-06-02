// 카카오 회원가입
import { getAPI, postAPI } from "@shared/utils/apiMethods";

import { signUpBodyType } from "@features/auth/signUp/signUp.type";

export const postKakaoSignUp = (
  body: Omit<signUpBodyType, "pw" | "checkedPw">
) =>
  postAPI("/v1/auth/join/kakao", body, {
    withCredentials: true,
  });

// 랜덤 닉네임 생성
export const getRandomNickName = () =>
  getAPI<string>("/v1/auth/users/nickname/random");

// 닉네임 중복 확인
export const getCheckNickName = (nickname: string) =>
  getAPI<boolean>("/v1/auth/users/nickname/availability", { nickname });

// 아이디 중복 확인
export const getCheckUserId = (userId: string) =>
  getAPI<boolean>("/v1/auth/users/id", { userId });

// 회원가입
export const postSignUp = (body: signUpBodyType) =>
  postAPI("/v1/auth/join", body);
