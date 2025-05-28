import { create } from "zustand/react";

type authStoreType = {
  accessToken: string | null;
  setAccessToken: (token: string | null) => void;
  isLoggedIn: boolean;
};

export const useAuthStore = create<authStoreType>(set => ({
  accessToken: null,
  setAccessToken: token =>
    set({ accessToken: token, isLoggedIn: token !== null }),
  isLoggedIn: false
}));
