import { accountType } from "@features/auth/shared/account.type";

export type accessTokenType = {
  accessToken: string;
};

export type signInBodyType = accountType & {
  autoLogin: boolean;
};
