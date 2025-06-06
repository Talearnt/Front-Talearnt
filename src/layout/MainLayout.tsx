import { UIEvent, useEffect, useState } from "react";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";

import { useShallow } from "zustand/shallow";

import { getAccessTokenUseRefreshToken } from "@features/user/user.api";

import { classNames } from "@shared/utils/classNames";

import { useGetProfile } from "@features/user/user.hook";

import { useAuthStore } from "@store/user.store";

import { Button } from "@components/common/Button/Button";
import { LogoIcon } from "@components/common/icons/LogoIcon/LogoIcon";
import { NotificationIcon } from "@components/common/icons/styled/NotificationIcon";
import { Prompt } from "@components/layout/Prompt/Prompt";
import { TalentsSettingModal } from "@components/layout/TalentsSettingModal/TalentsSettingModal";
import { Toast } from "@components/layout/Toast/Toast";

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

  const {
    data: {
      data: { giveTalents },
    },
    isSuccess,
  } = useGetProfile();

  const { accessToken, setAccessToken, isLoggedIn } = useAuthStore(
    useShallow(state => ({
      accessToken: state.accessToken,
      setAccessToken: state.setAccessToken,
      isLoggedIn: state.isLoggedIn,
    }))
  );

  const [isLoading, setIsLoading] = useState(true);
  const [isTopButtonVisible, setIsTopButtonVisible] = useState(false);

  const toggleTopButtonOnScroll = ({
    currentTarget: { scrollTop },
  }: UIEvent<HTMLDivElement>) => setIsTopButtonVisible(scrollTop > 150);
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
                <NotificationIcon className={"stroke-talearnt_Icon_01"} />
                <div className={"flex items-center"}>
                  <div
                    className={
                      "h-8 w-8 rounded-full border border-talearnt_Icon_03 bg-talearnt_BG_Up_02"
                    }
                  />
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M4.60482 5.69531H11.3952C11.5153 5.69582 11.6326 5.73193 11.7322 5.79908C11.8318 5.86623 11.9092 5.96141 11.9547 6.07258C12.0002 6.18374 12.0118 6.30591 11.9878 6.42362C11.9639 6.54134 11.9056 6.64932 11.8203 6.73391L8.43123 10.123C8.37477 10.1799 8.30759 10.2251 8.23358 10.256C8.15957 10.2868 8.08018 10.3027 8 10.3027C7.91982 10.3027 7.84043 10.2868 7.76642 10.256C7.69241 10.2251 7.62523 10.1799 7.56877 10.123L4.17966 6.73391C4.09438 6.64932 4.03609 6.54134 4.01217 6.42362C3.98824 6.30591 3.99977 6.18374 4.04527 6.07258C4.09078 5.96141 4.16823 5.86623 4.26783 5.79908C4.36743 5.73193 4.4847 5.69582 4.60482 5.69531Z"
                      fill="#414A4E"
                    />
                  </svg>
                </div>
              </>
            )}
          </div>
        </div>
      </header>
      <div
        className={classNames(
          "grid grid-rows-[1fr_208px]",
          "h-[calc(100vh-90px)] min-w-[1440px] overflow-y-auto"
        )}
        onScroll={toggleTopButtonOnScroll}
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
