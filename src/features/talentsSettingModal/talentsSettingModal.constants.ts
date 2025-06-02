import { talentsType } from "@features/talentsSettingModal/talentsSettingModal.type";

export const CURRENT_TALENTS_TYPE_NAME: Record<talentsType, string> =
  Object.freeze({
    giveTalents: "나의 재능",
    receiveTalents: "관심있는 재능",
  });
