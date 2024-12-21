import { useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";

import { classNames } from "@utils/classNames";

import { useKakaoAuthResponseStore } from "@pages/auth/auth.store";

function Kakao() {
  const navigator = useNavigate();
  const { pathname } = useLocation();

  const { kakaoAuthResponse } = useKakaoAuthResponseStore();

  const pathArray = pathname.split("/");
  const currentPage = pathArray[pathArray.length - 1];

  useEffect(() => {
    if (currentPage !== "oauth" && kakaoAuthResponse === null) {
      navigator("/sign-in");
    }
  }, [currentPage, kakaoAuthResponse, navigator]);

  return (
    <div className={classNames("flex flex-col gap-[56px]", "w-[632px]")}>
      <Outlet />
    </div>
  );
}

export default Kakao;
