import { useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";

import { useShallow } from "zustand/shallow";

import { getAccessTokenUseRefreshToken } from "@features/user/user.api";

import { classNames } from "@shared/utils/classNames";
import { getCookie } from "@shared/utils/getCookie";

import { useRealtimeNotifications } from "@features/notifications/notifications.hook";
import { useGetProfile } from "@features/user/profile/profile.hook";

import { useAuthStore } from "@store/user.store";

import { Spinner } from "@components/common/Spinner/Spinner";
import { Footer } from "@components/layout/Footer/Footer";
import { Header } from "@components/layout/Header/Header";
import { Prompt } from "@components/layout/Prompt/Prompt";
import { TalentsSettingModal } from "@components/layout/TalentsSettingModal/TalentsSettingModal";
import { Toast } from "@components/layout/Toast/Toast";
import { TopButton } from "@components/layout/TopButton/TopButton";

const AUTH_COOKIE_NAME = "isLoggedIn";

function MainLayout() {
  const { pathname } = useLocation();

  const [isLoading, setIsLoading] = useState(true);
  const [isTopButtonVisible, setIsTopButtonVisible] = useState(false);

  const { accessToken, setAccessToken } = useAuthStore(
    useShallow(state => ({
      accessToken: state.accessToken,
      setAccessToken: state.setAccessToken,
    }))
  );

  const {
    data: {
      data: { giveTalents },
    },
    isSuccess,
  } = useGetProfile();
  // 실시간 알림 기능: 레이아웃에서 항상 마운트
  useRealtimeNotifications();

  const isAuthPage =
    pathname.startsWith("/sign-") ||
    pathname.startsWith("/find-account") ||
    pathname.startsWith("/kakao") ||
    pathname.startsWith("/withdrawal");

  // 메모리에 accessToken 저장
  useEffect(() => {
    // 서버가 설정한 쿠키로 로그인 여부 확인 (불필요한 API 호출 방지)
    if (accessToken === null && getCookie(AUTH_COOKIE_NAME) === "true") {
      getAccessTokenUseRefreshToken()
        .then(({ data }) => setAccessToken(data.accessToken))
        .catch((error: unknown) => console.error("Token refresh failed", error))
        .finally(() => setIsLoading(false));
    } else {
      // 로그인하지 않은 사용자는 로딩 즉시 종료
      setIsLoading(false);
    }
  }, [accessToken, setAccessToken]);
  // 페이지 이동 시 스크롤 초기화
  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [pathname]);
  // 탑버튼 표시 여부
  useEffect(() => {
    const handleWindowScroll = () => {
      setIsTopButtonVisible(window.scrollY > 150);
    };

    window.addEventListener("scroll", handleWindowScroll);
    return () => window.removeEventListener("scroll", handleWindowScroll);
  }, []);

  return (
    <>
      <Header />
      {isLoading ? (
        <div className={classNames("flex flex-1 items-center justify-center")}>
          <Spinner />
        </div>
      ) : (
        <div className={classNames("flex-1", "min-w-[1440px]")}>
          <main
            className={classNames(
              "mx-auto mb-[120px] w-[1440px] px-20",
              isAuthPage ? "mt-24" : "mt-10"
            )}
          >
            <Outlet />
          </main>
        </div>
      )}
      <Footer />
      <Toast />
      <Prompt />
      {isTopButtonVisible && <TopButton />}
      {isSuccess && giveTalents.length === 0 && <TalentsSettingModal />}
    </>
  );
}

export default MainLayout;
