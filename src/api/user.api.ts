import { getAPI } from "@utils/apiMethods";

import { profileType } from "@type/user.type";

export const getProfile = async () =>
  getAPI<profileType>("/v1/users/header/profile", undefined, {
    withCredentials: true
  });
