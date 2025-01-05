import { postAPI } from "@utils/apiMethods";

import { talentsType } from "@modal/TalentsSettingModal/talentsSettingModal.type";

export const postTalents = async (talents: Record<talentsType, number[]>) =>
  await postAPI("/v1/users/my-talents", talents, { withCredentials: true });
