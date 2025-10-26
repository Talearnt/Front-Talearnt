import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  getAgreements,
  patchAdvertisingAgreement,
  patchMarketingAgreement,
} from "@features/user/accountSetting/accountSetting.api";

import { CACHE_POLICIES } from "@shared/cache/policies/cachePolicies";
import { QueryKeyFactory } from "@shared/cache/queryKeys/queryKeyFactory";

import { useQueryWithInitial } from "@shared/hooks/useQueryWithInitial";

import { changeableAgreementsType } from "@features/user/accountSetting/accountSetting.type";
import { customAxiosResponseType } from "@shared/type/api.type";

const agreementsQueryKey = QueryKeyFactory.user.agreements();

export const useGetAgreements = () =>
  useQueryWithInitial(
    {
      marketing: true,
      advertising: true,
    },
    {
      queryKey: agreementsQueryKey,
      queryFn: getAgreements,
      ...CACHE_POLICIES.AGREEMENTS,
    }
  );

export const usePatchMarketingAgreement = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: patchMarketingAgreement,
    onMutate: async isAgree => {
      /* [onMutate] 1) 관련 쿼리 취소 */
      await queryClient.cancelQueries({
        queryKey: agreementsQueryKey,
      });

      /* [onMutate] 2) 현재 상태 스냅샷 저장 */
      const previousAgreements = queryClient.getQueryData(agreementsQueryKey);

      /* [onMutate] 3) Optimistic Update - 약관 동의 여부 변경 */
      queryClient.setQueryData<
        customAxiosResponseType<changeableAgreementsType>
      >(agreementsQueryKey, oldData => {
        if (!oldData) {
          return oldData;
        }

        return {
          ...oldData,
          data: {
            ...oldData.data,
            marketing: isAgree,
          },
        };
      });

      return { previousAgreements };
    },
    onError: (_err, _variables, context) => {
      /* [onError] 스냅샷으로 롤백 */
      if (context?.previousAgreements) {
        queryClient.setQueryData(
          agreementsQueryKey,
          context.previousAgreements
        );
      }
    },
  });
};

export const usePatchAdvertisingAgreement = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: patchAdvertisingAgreement,
    onMutate: async isAgree => {
      /* [onMutate] 1) 관련 쿼리 취소 */
      await queryClient.cancelQueries({
        queryKey: agreementsQueryKey,
      });

      /* [onMutate] 2) 현재 상태 스냅샷 저장 */
      const previousAgreements = queryClient.getQueryData(agreementsQueryKey);

      /* [onMutate] 3) Optimistic Update - 약관 동의 여부 변경 */
      queryClient.setQueryData<
        customAxiosResponseType<changeableAgreementsType>
      >(agreementsQueryKey, oldData => {
        if (!oldData) {
          return oldData;
        }

        return {
          ...oldData,
          data: {
            ...oldData.data,
            advertising: isAgree,
          },
        };
      });

      return { previousAgreements };
    },
    onError: (_err, _variables, context) => {
      /* [onError] 스냅샷으로 롤백 */
      if (context?.previousAgreements) {
        queryClient.setQueryData(
          agreementsQueryKey,
          context.previousAgreements
        );
      }
    },
  });
};
