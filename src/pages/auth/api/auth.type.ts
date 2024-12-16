// 계정
export type accountType = {
  userId: string;
  pw: string;
};

// 이용 약관
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

// 인증번호 전송 body
export type verificationBodyType = {
  name?: string;
  type: "signUp" | "findId";
  phone: string;
};

// 인증 되었는지 확인하는 state
export type verificationStateType = {
  isCodeVerified: boolean;
  phone?: string;
};

// ID 찾기 response
export type findIdResponseType = {
  userId: string;
  createdAt: string;
};

// 카카오 로그인 response
export type kakaoAuthResponseType = Pick<
  signUpBodyType,
  "gender" | "name" | "phone" | "userId"
> & {
  accessToken: string;
  isRegistered: boolean;
};
