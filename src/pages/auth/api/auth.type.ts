export type accountType = {
  userId: string;
  pw: string;
};

export type verificationBodyType = {
  name?: string;
  type: "signUp" | "findId";
  phone: string;
};

export type submitVerificationBodyType = verificationBodyType & {
  code: string;
};
