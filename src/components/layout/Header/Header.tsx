import { useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";

import { classNames } from "@shared/utils/classNames";

import { useGetProfile } from "@features/user/profile/profile.hook";

import { useNotificationStore } from "@features/notifications/notifications.store";
import { useAuthStore } from "@store/user.store";

import { Button } from "@components/common/Button/Button";
import { LogoIcon } from "@components/common/icons/LogoIcon/LogoIcon";
import { NotificationIcon } from "@components/common/icons/styled/NotificationIcon";
import { Notifications } from "@components/layout/Notifications/Notifications";
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

function Header() {
  const navigator = useNavigate();
  const { pathname, search } = useLocation();

  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  const isLoggedIn = useAuthStore(state => state.isLoggedIn);
  const getUnreadCount = useNotificationStore(state => state.getUnreadCount);

  const {
    data: {
      data: { profileImg },
    },
  } = useGetProfile();

  const unreadCount = getUnreadCount();
  const isAuthPage =
    pathname.startsWith("/sign-") ||
    pathname.startsWith("/find-account") ||
    pathname.startsWith("/kakao") ||
    pathname.startsWith("/withdrawal");

  return (
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
        <LogoIcon className={"cursor-pointer"} onClick={() => navigator("/")} />
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
              onClick={() => {
                if (isLoggedIn) {
                  navigator(
                    `/write-article/${pathname.includes("community") ? "community" : "matching"}`
                  );
                } else {
                  const noRedirectPage = pathname === "/" || isAuthPage;

                  navigator(
                    `/sign-in${noRedirectPage ? "" : `?redirect=${encodeURIComponent(pathname + search)}`}`
                  );
                }
              }}
            >
              {isLoggedIn ? "글쓰기" : "로그인"}
            </Button>
          </div>
          {isLoggedIn && (
            <>
              <div className={classNames("relative", "flex")}>
                <button
                  className={classNames("relative", "p-1")}
                  onClick={() => setIsNotificationsOpen(prev => !prev)}
                >
                  <NotificationIcon className={"stroke-talearnt_Icon_01"} />
                  {unreadCount === 0 && (
                    <span
                      className={classNames(
                        "absolute right-px top-px",
                        "grid place-items-center",
                        "h-[13px] min-w-[13px] rounded-full bg-talearnt_Error_03 px-1",
                        "text-label1_10_semibold text-talearnt_On_Primary"
                      )}
                    >
                      {/* {unreadCount > 99 ? "99+" : unreadCount} */}
                      11
                    </span>
                  )}
                </button>
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
  );
}

export { Header };
