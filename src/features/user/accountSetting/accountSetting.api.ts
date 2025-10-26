import { getAPI, patchAPI } from "@shared/utils/apiMethods";

import { changeableAgreementsType } from "@features/user/accountSetting/accountSetting.type";

export const getAgreements = () =>
  getAPI<changeableAgreementsType>("/v1/users/agreements", undefined, {
    withCredentials: true,
  });

export const patchMarketingAgreement = (isAgree: boolean) =>
  patchAPI(
    "/v1/users/agreements/marketing",
    { isAgree },
    { withCredentials: true }
  );

export const patchAdvertisingAgreement = (isAgree: boolean) =>
  patchAPI(
    "/v1/users/agreements/advertising",
    { isAgree },
    { withCredentials: true }
  );
