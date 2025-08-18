import { useEffect, useState } from "react";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";

import { useShallow } from "zustand/shallow";

import { getAccessTokenUseRefreshToken } from "@features/user/user.api";

import { classNames } from "@shared/utils/classNames";

import { useRealtimeNotifications } from "@features/notifications/notifications.hook";
import { useGetProfile } from "@features/user/profile/profile.hook";

import { useNotificationStore } from "@features/notifications/notifications.store";
import { useAuthStore } from "@store/user.store";

import { Button } from "@components/common/Button/Button";
import { LogoIcon } from "@components/common/icons/LogoIcon/LogoIcon";
import { NotificationIcon } from "@components/common/icons/styled/NotificationIcon";
import { Notifications } from "@components/layout/Notifications/Notifications";
import { Prompt } from "@components/layout/Prompt/Prompt";
import { TalentsSettingModal } from "@components/layout/TalentsSettingModal/TalentsSettingModal";
import { Toast } from "@components/layout/Toast/Toast";
import { AvatarDropdown } from "@components/user/profile/AvatarDropdown";

const linkArray = [
  {
    path: "matching",
    content: "매칭",
  },
  {
    path: "community",
    content: "커뮤니티",
  },
  {
    path: "sign-up/agreements",
    content: "회원가입",
  },
];

function MainLayout() {
  const navigator = useNavigate();
  const { pathname } = useLocation();

  const [isLoading, setIsLoading] = useState(true);
  const [isTopButtonVisible, setIsTopButtonVisible] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  const { accessToken, setAccessToken, isLoggedIn } = useAuthStore(
    useShallow(state => ({
      accessToken: state.accessToken,
      setAccessToken: state.setAccessToken,
      isLoggedIn: state.isLoggedIn,
    }))
  );
  const getUnreadCount = useNotificationStore(state => state.getUnreadCount);

  const {
    data: {
      data: { giveTalents, profileImg },
    },
    isSuccess,
  } = useGetProfile();
  // 실시간 알림 기능: 레이아웃에서 항상 마운트
  useRealtimeNotifications();

  const unreadCount = getUnreadCount();

  const handleScroll = () => window.scrollTo({ top: 0, behavior: "smooth" });

  // 메모리에 accessToken 저장
  useEffect(() => {
    if (accessToken === null) {
      getAccessTokenUseRefreshToken()
        .then(({ data }) => {
          setAccessToken(data.accessToken);
        })
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
      <header
        className={classNames(
          "sticky top-0",
          "z-30 min-w-[1440px] border-b border-talearnt_Line_01 bg-talearnt_BG_Background"
        )}
      >
        <div
          className={classNames(
            "flex items-center justify-between",
            "mx-auto h-[89px] w-[1440px] px-[80px]"
          )}
        >
          <LogoIcon
            className={"cursor-pointer"}
            onClick={() => navigator("/")}
          />
          <div className={"flex items-center gap-6"}>
            <div className={"flex gap-2"}>
              {linkArray.map(({ path, content }) => {
                if (content === "회원가입" && isLoggedIn) {
                  return;
                }

                return (
                  <NavLink
                    className={({ isActive }) =>
                      classNames(
                        "px-4 py-2",
                        "text-body2_16_semibold text-talearnt_Text_02",
                        isActive && "text-talearnt_Primary_01"
                      )
                    }
                    to={path}
                    key={path}
                  >
                    {content}
                  </NavLink>
                );
              })}
              <Button
                buttonStyle={"outlined"}
                className={classNames("w-[100px]", "text-body2_16_semibold")}
                size={"small"}
                onClick={() =>
                  navigator(
                    isLoggedIn
                      ? `write-article/${pathname.includes("community") ? "community" : "matching"}`
                      : "sign-in"
                  )
                }
              >
                {isLoggedIn ? "글쓰기" : "로그인"}
              </Button>
            </div>
            {isLoggedIn && (
              <>
                <div className={classNames("relative", "flex")}>
                  <button
                    className={"p-1"}
                    onClick={() => setIsNotificationsOpen(prev => !prev)}
                  >
                    <NotificationIcon className={"stroke-talearnt_Icon_01"} />
                  </button>
                  {unreadCount > 0 && (
                    <span
                      className={classNames(
                        "absolute right-[1px] top-[1px]",
                        "grid place-items-center",
                        "h-[13px] min-w-[13px] rounded-full bg-talearnt_Error_03 px-1",
                        "text-label1_10_semibold text-talearnt_On_Primary"
                      )}
                    >
                      {unreadCount > 99 ? "99+" : unreadCount}
                    </span>
                  )}
                  {isNotificationsOpen && (
                    <Notifications
                      onClose={() => setIsNotificationsOpen(false)}
                    />
                  )}
                </div>
                <AvatarDropdown profileImg={profileImg} />
              </>
            )}
          </div>
        </div>
      </header>
      <div
        className={classNames("grid grid-rows-[1fr_208px]", "min-w-[1440px]")}
      >
        <main className={"mx-auto w-[1440px] px-20"}>
          <Outlet />
        </main>
        <footer
          className={classNames(
            "flex items-center justify-between",
            "mt-[120px] w-[1440px] border-t border-talearnt_Line_01 px-20"
          )}
        >
          푸터
        </footer>
      </div>

      {/* 탑버튼 */}
      {isTopButtonVisible && (
        <svg
          onClick={handleScroll}
          width="60"
          height="60"
          viewBox="0 0 60 60"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={classNames(
            "fixed bottom-10 right-10",
            "rounded-full fill-talearnt_Icon_04",
            "cursor-pointer",
            "hover:fill-talearnt_Icon_01"
          )}
        >
          <rect width="60" height="60" rx="30" />
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M30.6688 16.5518C30.4982 16.3622 30.255 16.2539 29.9999 16.2539C29.7447 16.2539 29.5016 16.3622 29.3309 16.5518L17.7635 29.4045C17.431 29.774 17.461 30.343 17.8304 30.6755C18.1999 31.0081 18.7689 30.9781 19.1014 30.6086L29.0999 19.4993V42.8469C29.0999 43.344 29.5028 43.7469 29.9999 43.7469C30.4969 43.7469 30.8999 43.344 30.8999 42.8469V19.4993L40.8983 30.6086C41.2308 30.9781 41.7999 31.0081 42.1693 30.6755C42.5388 30.343 42.5688 29.774 42.2362 29.4045L30.6688 16.5518Z"
            fill="white"
          />
        </svg>
      )}
      <Toast />
      <Prompt />
      {isSuccess && giveTalents.length === 0 && <TalentsSettingModal />}
    </>
  );
}

export default MainLayout;
