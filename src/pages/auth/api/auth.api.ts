import { postAPI } from "@utils/apiMethods";

import { customAxiosResponseType } from "@common/common.type";
import { accountType } from "@pages/auth/api/auth.type";

export const postSignIn = async (
  account: accountType
): Promise<customAxiosResponseType<{ accessToken: string }>> =>
  await postAPI("/v1/api/auth/login", account);

export const postToGetRefreshToken = async () =>
  await postAPI("/v1/api/auth/refresh");
