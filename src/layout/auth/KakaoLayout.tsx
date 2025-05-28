import { useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";

import { useKakaoAuthResponseStore } from "@features/auth/signUp/signUp.store";

import { AuthLayout } from "@layout/auth/AuthLayout";

function KakaoLayout() {
  const navigator = useNavigate();
  const { pathname } = useLocation();

  const kakaoAuthResponse = useKakaoAuthResponseStore(
    state => state.kakaoAuthResponse
  );

  const pathArray = pathname.split("/");
  const currentPage = pathArray[pathArray.length - 1];

  useEffect(() => {
    if (currentPage !== "oauth" && kakaoAuthResponse === null) {
      navigator("/sign-in");
    }
  }, [currentPage, kakaoAuthResponse, navigator]);

  return (
    <AuthLayout>
      <Outlet />
    </AuthLayout>
  );
}

export default KakaoLayout;
