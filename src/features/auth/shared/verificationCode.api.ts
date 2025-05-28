import { postAPI } from "@shared/utils/apiMethods";

import { verificationBodyType } from "@features/auth/shared/verificationCode.type";

// 인증번호 전송
export const postSendVerificationCode = (data: verificationBodyType) =>
  postAPI("/v1/auth/sms/verification-codes", data);

// 인증번호 검증
export const postConfirmVerificationCode = <T>(
  data: verificationBodyType & {
    code: string;
  }
) => postAPI<T>("/v1/auth/sms/validation", data);
