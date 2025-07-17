import { AccountIcon } from "@components/common/icons/styled/AccountIcon";
import { ChatIcon } from "@components/common/icons/styled/ChatIcon";
import { HeadsetIcon } from "@components/common/icons/styled/HeadsetIcon";
import { HeartIcon } from "@components/common/icons/styled/HeartIcon";
import { NoteIcon } from "@components/common/icons/styled/NoteIcon";
import { NotificationIcon } from "@components/common/icons/styled/NotificationIcon";
import { SettingIcon } from "@components/common/icons/styled/SettingIcon";

export const userSidebarArray = [
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
        path: "favorites",
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
        path: "posts",
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
        path: "comments",
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
        path: "account",
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
        path: "notification",
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
        path: "notice-event/event",
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
        path: "support",
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
