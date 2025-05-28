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
