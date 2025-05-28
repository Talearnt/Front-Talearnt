// 이용 약관
import { accountType } from "@features/auth/shared/account.type";

export type agreementType = {
  agreeCodeId: number;
  agree: boolean;
  required: boolean;
  title: string;
};

// 회원가입 body
export type signUpBodyType = accountType & {
  checkedPw: string;
  name: string;
  nickname: string;
  gender: string;
  phone: string;
  agreeReqDTOS: Pick<agreementType, "agreeCodeId" | "agree">[];
};

// 카카오 회원가입
export type kakaoAuthResponseType = Omit<signUpBodyType, "checkedPw" | "pw">;
