import { useEffect, useRef, useState } from "react";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";

import { useShallow } from "zustand/shallow";

import { getAccessTokenUseRefreshToken } from "@pages/auth/core/auth.api";

import { classNames } from "@utils/classNames";

import { useGetProfile } from "@hook/user.hook";

import { useMainScrollRefStore, usePromptStore } from "@common/common.store";
import { useAuthStore } from "@pages/auth/core/auth.store";

import { Prompt } from "@modal/Prompt/Prompt";
import { TalentsSettingModal } from "@modal/TalentsSettingModal/TalentsSettingModal";
import { Toast } from "@modal/Toast/Toast";

import { Button } from "@components/Button/Button";
import { LogoIcon } from "@components/icons/LogoIcon/LogoIcon";
import { NotificationIcon } from "@components/icons/NotificationIcon/NotificationIcon";
import { TopButton } from "@components/TopButton/TopButton";

const linkArray = [
  {
    path: "matching",
    content: "매칭"
  },
  {
    path: "community",
    content: "커뮤니티"
  },
  {
    path: "sign-up/agreements",
    content: "회원가입"
  }
];

function MainLayout() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const topButtonRef = useRef<SVGSVGElement>(null);
  const navigator = useNavigate();
  const { pathname } = useLocation();

  const {
    data: {
      data: { giveTalents }
    },
    isSuccess
  } = useGetProfile();

  const { accessToken, setAccessToken, isLoggedIn } = useAuthStore(
    useShallow(state => ({
      accessToken: state.accessToken,
      setAccessToken: state.setAccessToken,
      isLoggedIn: state.isLoggedIn
    }))
  );
  const promptData = usePromptStore(state => state.promptData);
  const setMainScrollRef = useMainScrollRefStore(
    state => state.setMainScrollRef
  );

  const [isLoading, setIsLoading] = useState(true);

  const handleScroll = () => {
    if (!scrollRef.current || !topButtonRef.current) {
      return;
    }

    topButtonRef.current.style.display =
      scrollRef.current.scrollTop > 150 ? "block" : "none";
  };

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
  // 스크롤용 ref 저장
  useEffect(() => {
    setMainScrollRef(scrollRef);
  }, [setMainScrollRef]);
  // 페이지 이동 시 스크롤 초기화
  useEffect(() => {
    if (!scrollRef.current) {
      return;
    }

    scrollRef.current.scrollTo({ top: 0 });
  }, [pathname]);

  if (isLoading) {
    return null;
  }

  return (
    <>
      <header
        className={classNames("h-[90px] border-b border-talearnt_Line_01")}
      >
        <div
          className={classNames(
            "flex items-center justify-between",
            "mx-auto h-full w-[1440px] px-[80px]"
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
                <NotificationIcon />
                <div className={"flex items-center"}>
                  <div
                    className={
                      "h-8 w-8 rounded-full border border-talearnt_Icon_02 bg-talearnt_BG_Up_02"
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
        ref={scrollRef}
        className={classNames(
          "flex flex-col",
          "h-[calc(100vh-90px)] overflow-y-auto"
        )}
        onScroll={handleScroll}
      >
        <main className={classNames("flex-1", "mx-auto w-[1440px] px-20")}>
          <Outlet />
        </main>
        <footer
          className={classNames(
            "flex shrink-0 items-center justify-between",
            "mt-[120px] h-[88px] border-t border-talearnt_Line_01 px-20"
          )}
        >
          푸터
        </footer>
      </div>
      <TopButton topButtonRef={topButtonRef} />
      <Toast />
      {promptData && <Prompt />}
      {isSuccess && giveTalents.length === 0 && <TalentsSettingModal />}
    </>
  );
}

export default MainLayout;
