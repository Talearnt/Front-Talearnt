export type accountType = {
  userId: string;
  pw: string;
};

export type verificationBodyType = {
  type?: "회원가입" | "아이디찾기";
  phone: string;
};

export type submitVerificationBodyType = verificationBodyType & {
  code: string;
};
