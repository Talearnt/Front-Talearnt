import { getAPI, putAPI } from "@shared/utils/apiMethods";

import {
  activityCountsType,
  profileType,
} from "@features/user/profile/profile.type";

// 프로필 조회
export const getProfile = () =>
  getAPI<profileType>("/v1/users/header/profile", undefined, {
    withCredentials: true,
  });

//프로필 수정
export const putProfile = (data: Omit<profileType, "userId" | "userNo">) =>
  putAPI<profileType>("v1/users/profile", data, {
    withCredentials: true,
  });

// 활동 counts 조회
export const getActivityCounts = () =>
  getAPI<activityCountsType>("v1/users/profile/activity-counts", undefined, {
    withCredentials: true,
  });
