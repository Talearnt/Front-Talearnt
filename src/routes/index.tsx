import { createBrowserRouter } from "react-router-dom";

import authRouter from "@routes/auth";

import { getAccessTokenUseRefreshToken } from "@pages/auth/api/auth.api";

import { useAuthStore } from "@pages/auth/api/auth.store";

import MainLayout from "@layout/MainLayout/MainLayout";

import { accessTokenType } from "@pages/auth/api/auth.type";

const authLoader = async () => {
  const { accessToken, setAccessToken } = useAuthStore.getState();

  if (!accessToken) {
    try {
      const { data } = await getAccessTokenUseRefreshToken();
      setAccessToken((data as accessTokenType).accessToken);
    } catch (error) {
      console.error("Token refresh failed", error); // 에러는 로깅
    }
  }

  return null;
};

const router = createBrowserRouter([
  {
    element: <MainLayout />,
    path: "/",
    loader: authLoader,
    children: [...authRouter]
  }
]);

export default router;
