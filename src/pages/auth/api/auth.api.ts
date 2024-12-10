import { getAPI, postAPI } from "@utils/apiMethods";

import { customAxiosResponseType } from "@common/common.type";
import {
  accountType,
  submitVerificationBodyType,
  verificationBodyType
} from "@pages/auth/api/auth.type";

// 로그인
export const postSignIn = async (
  account: accountType
): Promise<customAxiosResponseType<{ accessToken: string }>> =>
  await postAPI("/v1/api/auth/login", account);

// refresh 토큰
export const postToGetRefreshToken = async () =>
  await postAPI("/v1/api/auth/refresh");

// 인증번호 전송
export const postSendVerificationCode = async (data: verificationBodyType) =>
  await postAPI("/v1/auth/sms/verification-codes", data);

// 인증번호 검증
export const postConfirmVerificationCode = async (
  data: submitVerificationBodyType
) => await postAPI("/v1/auth/sms/validation", data);

// 랜덤 닉네임 생성
export const getRandomNickName = async () =>
  await getAPI<string>("/v1/auth/users/nickname/random");

// 닉네임 중복 확인
export const getCheckNickName = async (nickname: string) =>
  await getAPI<boolean>("/v1/auth/users/nickname/availability", { nickname });

// 아이디 중복 확인
export const getCheckUserId = async (userId: string) =>
  await getAPI<boolean>("/v1/auth/users/id", { userId });
