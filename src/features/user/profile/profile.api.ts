import { putAPI } from "@shared/utils/apiMethods";

import { profileType } from "@features/user/user.type";

//프로필 수정
export const putProfile = (data: Omit<profileType, "userId" | "userNo">) =>
  putAPI<profileType>(`v1/users/profile`, data, {
    withCredentials: true,
  });
