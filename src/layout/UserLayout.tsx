import { NavLink, Outlet } from "react-router-dom";

import { classNames } from "@shared/utils/classNames";

import { AccountIcon } from "@components/common/icons/styled/AccountIcon";
import { ChatIcon } from "@components/common/icons/styled/ChatIcon";
import { HeadsetIcon } from "@components/common/icons/styled/HeadsetIcon";
import { HeartIcon } from "@components/common/icons/styled/HeartIcon";
import { NoteIcon } from "@components/common/icons/styled/NoteIcon";
import { NotificationIcon } from "@components/common/icons/styled/NotificationIcon";
import { SettingIcon } from "@components/common/icons/styled/SettingIcon";

const sideBarArray = [
  {
    category: "마이페이지",
    items: [
      {
        path: "",
        content: ({ isActive }: { isActive: boolean }) => (
          <>
            <AccountIcon iconType={isActive ? "filled-blue" : "outlined"} />
            <span
              className={`text-body1_18_semibold ${
                isActive ? "text-talearnt_Primary_01" : "text-talearnt_Text_02"
              }`}
            >
              내 프로필
            </span>
          </>
        ),
      },
    ],
  },
  {
    category: "내 활동",
    items: [
      {
        path: "/likes",
        content: ({ isActive }: { isActive: boolean }) => (
          <>
            <HeartIcon iconType={isActive ? "filled-blue" : "outlined"} />
            <span
              className={`text-body1_18_semibold ${
                isActive ? "text-talearnt_Primary_01" : "text-talearnt_Text_02"
              }`}
            >
              찜 목록
            </span>
          </>
        ),
      },
      {
        path: "/posts",
        content: ({ isActive }: { isActive: boolean }) => (
          <>
            <NoteIcon iconType={isActive ? "filled-blue" : "outlined"} />
            <span
              className={`text-body1_18_semibold ${
                isActive ? "text-talearnt_Primary_01" : "text-talearnt_Text_02"
              }`}
            >
              작성한 게시물
            </span>
          </>
        ),
      },
      {
        path: "/comments",
        content: ({ isActive }: { isActive: boolean }) => (
          <>
            <ChatIcon iconType={isActive ? "filled-blue" : "outlined"} />
            <span
              className={`text-body1_18_semibold ${
                isActive ? "text-talearnt_Primary_01" : "text-talearnt_Text_02"
              }`}
            >
              작성한 댓글
            </span>
          </>
        ),
      },
    ],
  },
  {
    category: "설정",
    items: [
      {
        path: "/account",
        content: ({ isActive }: { isActive: boolean }) => (
          <>
            <SettingIcon iconType={isActive ? "filled-blue" : "outlined"} />
            <span
              className={`text-body1_18_semibold ${
                isActive ? "text-talearnt_Primary_01" : "text-talearnt_Text_02"
              }`}
            >
              계정 관리
            </span>
          </>
        ),
      },
      {
        path: "/notification",
        content: ({ isActive }: { isActive: boolean }) => (
          <>
            <NotificationIcon
              iconType={isActive ? "filled-blue" : "outlined"}
            />
            <span
              className={`text-body1_18_semibold ${
                isActive ? "text-talearnt_Primary_01" : "text-talearnt_Text_02"
              }`}
            >
              알림 설정
            </span>
          </>
        ),
      },
    ],
  },
  {
    category: "기타",
    items: [
      {
        path: "/events",
        content: ({ isActive }: { isActive: boolean }) => (
          <>
            <SettingIcon iconType={isActive ? "filled-blue" : "outlined"} />
            <span
              className={`text-body1_18_semibold ${
                isActive ? "text-talearnt_Primary_01" : "text-talearnt_Text_02"
              }`}
            >
              이벤트/공지사항
            </span>
          </>
        ),
      },
      {
        path: "/support",
        content: ({ isActive }: { isActive: boolean }) => (
          <>
            <HeadsetIcon iconType={isActive ? "filled-blue" : "outlined"} />
            <span
              className={`text-body1_18_semibold ${
                isActive ? "text-talearnt_Primary_01" : "text-talearnt_Text_02"
              }`}
            >
              문의하기
            </span>
          </>
        ),
      },
    ],
  },
];

function UserLayout() {
  return (
    <div className={classNames("grid grid-cols-[277px_1fr] gap-12", "pt-8")}>
      <div className={"flex flex-col gap-6"}>
        {sideBarArray.map(({ category, items }) => (
          <div className={"flex flex-col gap-3"} key={category}>
            <div className={"px-4 py-2"}>
              <span
                className={"text-heading4_20_semibold text-talearnt_Text_01"}
              >
                {category}
              </span>
            </div>
            <div className={"flex flex-col gap-2"}>
              {items.map(({ path, content }) => (
                <NavLink
                  className={({ isActive }) =>
                    classNames(
                      "flex items-center gap-3",
                      "rounded-lg px-4 py-[15px]",
                      "hover:bg-talearnt_BG_Up_01",
                      isActive && "!bg-talearnt_PrimaryBG_01"
                    )
                  }
                  to={path}
                  key={path}
                >
                  {({ isActive }) => content({ isActive })}
                </NavLink>
              ))}
            </div>
          </div>
        ))}
      </div>
      <Outlet />
    </div>
  );
}

export default UserLayout;
