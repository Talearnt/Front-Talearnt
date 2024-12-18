import { getAPI, postAPI, putAPI } from "@utils/apiMethods";

import {
  accountType,
  findIdResponseType,
  signUpBodyType,
  submitVerificationBodyType,
  verificationBodyType
} from "@pages/auth/api/auth.type";

// 로그인
export const postSignIn = async (account: accountType) =>
  await postAPI<{ accessToken: string }>("/v1/auth/login", account);

// refresh 토큰
export const postToGetRefreshToken = async () =>
  await postAPI("/v1/api/auth/refresh");

// 인증번호 전송
export const postSendVerificationCode = async (data: verificationBodyType) =>
  await postAPI("/v1/auth/sms/verification-codes", data);

// 인증번호 검증
export const postConfirmVerificationCode = async (
  data: submitVerificationBodyType
) => await postAPI<true | findIdResponseType>("/v1/auth/sms/validation", data);

// 랜덤 닉네임 생성
export const getRandomNickName = async () =>
  await getAPI<string>("/v1/auth/users/nickname/random");

// 닉네임 중복 확인
export const getCheckNickName = async (nickname: string) =>
  await getAPI<boolean>("/v1/auth/users/nickname/availability", { nickname });

// 아이디 중복 확인
export const getCheckUserId = async (userId: string) =>
  await getAPI<boolean>("/v1/auth/users/id", { userId });

// 회원가입
export const postSignUp = async (body: signUpBodyType) =>
  await postAPI("/v1/auth/join", body);

// 비밀번호 찾기
export const postFindPwEmail = async (body: {
  phone: string;
  userId: string;
}) => await postAPI<{ sentDate: string }>("/v1/auth/password/email", body);

// 비밀번호 수정
export const putChangePw = async ({
  no,
  uuid,
  ...body
}: Pick<signUpBodyType, "checkedPw" | "pw"> & {
  no: string;
  uuid: string;
}) => await putAPI(`/v1/auth/${no}/password/${uuid}`, body);
