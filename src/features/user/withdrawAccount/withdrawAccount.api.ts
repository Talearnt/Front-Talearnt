import { postAPI } from "@shared/utils/apiMethods";

import {
  withdrawalBodyType,
  withdrawalResponseType,
} from "@features/user/withdrawAccount/withdrawAccount.type";

export const postWithdrawAccount = (body: withdrawalBodyType) =>
  postAPI<withdrawalResponseType>("/v1/users/withdrawal", body, {
    withCredentials: true,
  });
