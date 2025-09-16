import { useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";

import { useShallow } from "zustand/shallow";

import { getAccessTokenUseRefreshToken } from "@features/user/user.api";

import { classNames } from "@shared/utils/classNames";

import { useRealtimeNotifications } from "@features/notifications/notifications.hook";
import { useGetProfile } from "@features/user/profile/profile.hook";

import { useAuthStore } from "@store/user.store";

import { Footer } from "@components/layout/Footer/Footer";
import { Header } from "@components/layout/Header/Header";
import { Prompt } from "@components/layout/Prompt/Prompt";
import { TalentsSettingModal } from "@components/layout/TalentsSettingModal/TalentsSettingModal";
import { Toast } from "@components/layout/Toast/Toast";
import { TopButton } from "@components/layout/TopButton/TopButton";

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
    if (accessToken === null) {
      getAccessTokenUseRefreshToken()
        .then(({ data }) => setAccessToken(data.accessToken))
        .catch((error: unknown) => console.error("Token refresh failed", error))
        .finally(() => setIsLoading(false));
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

  if (isLoading) {
    return null;
  }

  return (
    <>
      <Header />
      <div className={classNames("flex-1", "min-w-[1440px]")}>
        <main
          className={classNames(
            "mx-auto w-[1440px] px-20",
            isAuthPage ? "mt-24" : "mt-10"
          )}
        >
          <Outlet />
        </main>
      </div>
      <Footer />
      <Toast />
      <Prompt />
      {isTopButtonVisible && <TopButton />}
      {isSuccess && giveTalents.length === 0 && <TalentsSettingModal />}
    </>
  );
}

export default MainLayout;
