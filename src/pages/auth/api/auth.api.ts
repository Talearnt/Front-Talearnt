import { postAPI } from "@utils/apiMethods";

import { customAxiosResponseType } from "@common/common.type";
import {
  accountType,
  submitVerificationBodyType,
  verificationBodyType
} from "@pages/auth/api/auth.type";

export const postSignIn = async (
  account: accountType
): Promise<customAxiosResponseType<{ accessToken: string }>> =>
  await postAPI("/v1/api/auth/login", account);

export const postToGetRefreshToken = async () =>
  await postAPI("/v1/api/auth/refresh");

export const postSendVerificationCode = async (data: verificationBodyType) =>
  await postAPI("/v1/auth/sms/verification-codes", data);

export const postSubmitVerificationCode = async (
  data: submitVerificationBodyType
) => await postAPI("/v1/auth/sms/validation", data);
