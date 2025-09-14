import { getAPI, patchAPI } from "@shared/utils/apiMethods";

import { changeableAgreementsType } from "@features/user/accountSetting/accountSetting.type";

export const getAgreements = () =>
  getAPI<changeableAgreementsType>("/v1/users/agreements", undefined, {
    withCredentials: true,
  });

export const patchMarketingAgreement = (agree: boolean) =>
  patchAPI(
    "/v1/users/agreements/marketing",
    { agree },
    { withCredentials: true }
  );

export const patchAdvertisingAgreement = (agree: boolean) =>
  patchAPI(
    "/v1/users/agreements/advertising",
    { agree },
    { withCredentials: true }
  );
