export type accountType = {
  userId: string;
  pw: string;
};

export type agreementType = {
  agreeCodeId: number;
  agree: boolean;
  required: boolean;
  title: string;
};

export type verificationBodyType = {
  name?: string;
  type: "signUp" | "findId";
  phone: string;
};

export type verificationStateType = {
  isCodeVerified: boolean;
  phone?: string;
};

export type submitVerificationBodyType = verificationBodyType & {
  code: string;
};

export type findIdResponseType = {
  userId: string;
  createdAt: string;
};

export type signUpBodyType = accountType & {
  checkedPw: string;
  name: string;
  nickname: string;
  gender: string;
  phone: string;
  agreeReqDTOS: Pick<agreementType, "agreeCodeId" | "agree">[];
};
