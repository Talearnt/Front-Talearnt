import { create } from "zustand/react";

type logoutRedirectType = {
  path: string;
  state?: unknown;
} | null;

type authStoreType = {
  accessToken: string | null;
  setAccessToken: (token: string | null) => void;
  isLoggedIn: boolean;
  logoutRedirect: logoutRedirectType;
  setLogoutRedirect: (redirect: logoutRedirectType) => void;
};

export const useAuthStore = create<authStoreType>(set => ({
  accessToken: null,
  setAccessToken: token =>
    set({ accessToken: token, isLoggedIn: token !== null }),
  isLoggedIn: false,
  logoutRedirect: null,
  setLogoutRedirect: redirect => set({ logoutRedirect: redirect }),
}));
