import { postAPI } from "@utils/apiMethods";

import { accountType } from "@pages/auth/common/auth.type";
import { customAxiosResponseType } from "@type/apiMethods.type";

export const signInApi = async (
  account: accountType
): Promise<customAxiosResponseType<{ accessToken: string } | null>> =>
  await postAPI("/v1/api/auth/login", account);
