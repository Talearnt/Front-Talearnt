import { getAPI, putAPI } from "@shared/utils/apiMethods";

import { notificationSettingType } from "@features/user/notificationSetting/notificationSetting.type";

// 알림 설정 조회
export const getNotificationSetting = () =>
  getAPI<notificationSettingType>("/notifications/settings", undefined, {
    withCredentials: true,
  });

// 알림 설정 수정
export const putNotificationSetting = (data: notificationSettingType) =>
  putAPI("/notifications/settings", data, {
    withCredentials: true,
  });
