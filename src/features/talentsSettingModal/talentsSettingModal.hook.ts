import { useQueryClient } from "@tanstack/react-query";

import { QueryKeyFactory } from "@shared/cache/queryKeys/queryKeyFactory";

import { useTalentsSettingModalStore } from "@features/talentsSettingModal/talentsSettingModal.store";

import { profileType } from "@features/user/profile/profile.type";
import { customAxiosResponseType } from "@shared/type/api.type";

export const useSetTalents = () => {
  const queryClient = useQueryClient();

  const talentsData = useTalentsSettingModalStore(state => state.talentsData);

  return () =>
    queryClient.setQueryData<customAxiosResponseType<profileType>>(
      QueryKeyFactory.user.profile(),
      oldData => {
        if (!oldData) {
          return oldData;
        }

        return {
          ...oldData,
          data: { ...oldData.data, ...talentsData },
        };
      }
    );
};
