import { useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";

import { classNames } from "@utils/classNames";

import { useKakaoAuthResponseStore } from "@pages/auth/core/auth.store";

function Kakao() {
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
    <div className={classNames("flex flex-col gap-[56px]", "mt-24 w-[632px]")}>
      <Outlet />
    </div>
  );
}

export default Kakao;
