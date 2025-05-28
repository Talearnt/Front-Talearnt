import { postAPI } from "@shared/utils/apiMethods";

import { talentsType } from "@features/talentsSettingModal/talentsSettingModal.type";

export const postTalents = (talents: Record<talentsType, number[]>) =>
  postAPI("/v1/users/my-talents", talents, { withCredentials: true });
