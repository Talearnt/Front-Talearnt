import { talentsType } from "@modal/TalentsSettingModal/core/talentsSettingModal.type";

export const CURRENT_TALENTS_TYPE_NAME: Record<talentsType, string> =
  Object.freeze({
    giveTalents: "나의 재능",
    receiveTalents: "관심있는 재능"
  });
