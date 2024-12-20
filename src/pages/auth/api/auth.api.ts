import { getAPI, postAPI, putAPI } from "@utils/apiMethods";

import {
  accessTokenType,
  accountType,
  findIdResponseType,
  signUpBodyType,
  verificationBodyType
} from "@pages/auth/api/auth.type";

// 로그인
export const postSignIn = async (account: accountType) =>
  await postAPI<accessTokenType>("/v1/auth/login", account, {
    withCredentials: true
  });

// 리프레시 토큰
export const getAccessTokenUseRefreshToken = async () =>
  await getAPI<accessTokenType>("v1/auth/login/refresh", undefined, {
    withCredentials: true
  });

// 카카오 로그인
export const getKakaoAccessToken = async (code: string) =>
  await getAPI<
    Pick<signUpBodyType, "gender" | "name" | "phone" | "userId"> & {
      accessToken: string;
      isRegistered: boolean;
    }
  >("/v1/auth/login/kakao", { code });

// 카카오 회원가입
export const postKakaoSignUp = async (
  body: Omit<signUpBodyType, "pw" | "checkedPw">
) => await postAPI("/v1/auth/join/kakao", body);

// refresh 토큰
export const postToGetRefreshToken = async () =>
  await postAPI("/v1/api/auth/refresh");

// 인증번호 전송
export const postSendVerificationCode = async (data: verificationBodyType) =>
  await postAPI("/v1/auth/sms/verification-codes", data);

// 인증번호 검증
export const postConfirmVerificationCode = async (
  data: verificationBodyType & {
    code: string;
  }
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

// 랜덤 닉네임 생성
export const getTest = async () =>
  await getAPI("/v1/posts/exchange/talents/offered", undefined, {
    withCredentials: true
  });
