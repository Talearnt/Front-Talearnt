import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  getNotificationSetting,
  putNotificationSetting,
} from "@features/user/notificationSetting/notificationSetting.api";

import { USER_CACHE_POLICIES } from "@shared/cache/policies/user.policies";
import { QueryKeyFactory } from "@shared/cache/queryKeys/queryKeyFactory";

import { useQueryWithInitial } from "@shared/hooks/useQueryWithInitial";

import { notificationSettingType } from "@features/user/notificationSetting/notificationSetting.type";

export const useGetNotificationSetting = () =>
  useQueryWithInitial(
    {
      allowKeywordNotifications: false,
      allowCommentNotifications: false,
    },
    {
      queryKey: QueryKeyFactory.user.notificationSetting(),
      queryFn: getNotificationSetting,
      ...USER_CACHE_POLICIES.NOTIFICATION_SETTING,
    }
  );

export const usePutNotificationSetting = () => {
  const queryClient = useQueryClient();

  const {
    data: { data },
  } = useGetNotificationSetting();

  return useMutation({
    mutationFn: (variables: Partial<notificationSettingType>) =>
      putNotificationSetting({ ...data, ...variables }),
    onSuccess: (_data, variables) =>
      // 알림 설정 캐시 직접 업데이트
      queryClient.setQueryData<notificationSettingType>(
        QueryKeyFactory.user.notificationSetting(),
        oldData => {
          if (!oldData) {
            return oldData;
          }

          return {
            ...oldData,
            data: variables,
          };
        }
      ),
  });
};
