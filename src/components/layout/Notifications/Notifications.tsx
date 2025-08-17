import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { useShallow } from "zustand/react/shallow";

import { formatRelativeTime } from "@features/notifications/notifications.util";
import { classNames } from "@shared/utils/classNames";
import { findTalentList } from "@shared/utils/findTalent";

import { useNotifications } from "@features/notifications/notifications.hook";

import { useNotificationStore } from "@features/notifications/notifications.store";
import { usePromptStore } from "@store/prompt.store";
import { useToastStore } from "@store/toast.store";

import { Dot } from "@components/common/Dot/Dot";
import { EmptyState } from "@components/common/EmptyState/EmptyState";
import { CloseIcon } from "@components/common/icons/CloseIcon/CloseIcon";
import { SettingIcon } from "@components/common/icons/styled/SettingIcon";

import type { notificationType } from "@features/notifications/notifications.type";

type NotificationTabType = "all" | "comment" | "keyword";
type NotificationsProps = {
  onClose: () => void;
};

const notificationTabs: { id: NotificationTabType; label: string }[] = [
  { id: "all", label: "전체" },
  { id: "comment", label: "댓글" },
  { id: "keyword", label: "관심 키워드" },
];

function Notifications({ onClose }: NotificationsProps) {
  const ref = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const navigator = useNavigate();
  const { pathname } = useLocation();

  const [selectedTab, setSelectedTab] = useState<NotificationTabType>("all");

  const { isLoading, notifications, getUnreadFlags } = useNotificationStore(
    useShallow(state => ({
      isLoading: state.isLoading,
      notifications: state.notifications,
      getUnreadFlags: state.getUnreadFlags,
    }))
  );
  const setPrompt = usePromptStore(state => state.setPrompt);
  const setToast = useToastStore(state => state.setToast);

  const { markAsRead, deleteNotification } = useNotifications();

  // 읽지 않은 알림 플래그
  const {
    all: hasUnreadAll,
    keyword: hasUnreadKeyword,
    comment: hasUnreadComment,
  } = getUnreadFlags();
  // 현재 탭 필터링
  const filtered: notificationType[] =
    selectedTab === "all"
      ? notifications
      : notifications.filter(({ notificationType }) =>
          selectedTab === "keyword"
            ? notificationType === "관심 키워드"
            : notificationType !== "관심 키워드"
        );
  // 탭별 알림 번호 목록
  const notificationNos = filtered.map(({ notificationNo }) => notificationNo);
  const unreadNotificationNos = filtered
    .filter(({ isRead }) => !isRead)
    .map(({ notificationNo }) => notificationNo);

  // 탭 변경 시 스크롤 최상단으로 이동
  useEffect(() => {
    if (!listRef.current) {
      return;
    }

    listRef.current.scrollTop = 0;
  }, [selectedTab]);
  // 외부 클릭 시 닫히게
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const triggerArea = ref.current?.parentElement;

      if (ref.current && !ref.current.contains(target)) {
        if (triggerArea && triggerArea.contains(target)) {
          return;
        }

        onClose();
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => e.key === "Escape" && onClose();

    window.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  return (
    <div
      ref={ref}
      className={classNames(
        "absolute right-[-64px] top-[51px] z-40",
        "flex flex-col",
        "h-[580px] w-[400px] overflow-hidden rounded-2xl border border-talearnt_Line_02 bg-talearnt_BG_Background pb-6 shadow-shadow_02"
      )}
      role={"dialog"}
      aria-label={"알림 목록"}
    >
      <div
        className={classNames("flex justify-between", "mb-1 px-6 pb-2 pt-5")}
      >
        <span className={"text-body1_18_semibold text-talearnt_Text_Strong"}>
          알림
        </span>
        <SettingIcon className={"stroke-talearnt_Icon_01"} />
      </div>
      <div
        className={classNames(
          "flex",
          "px-6 shadow-[inset_0_-1px_0_0] shadow-talearnt_Line_01"
        )}
      >
        {notificationTabs.map(({ id, label }) => {
          const showDot =
            id === "all"
              ? hasUnreadAll
              : id === "keyword"
                ? hasUnreadKeyword
                : hasUnreadComment;

          return (
            <button
              className={classNames(
                "grid flex-1 place-items-center",
                "h-10",
                "transition-border transition-colors duration-200",
                "text-body2_16_semibold text-talearnt_Text_04",
                "hover:text-talearnt_Text_02",
                selectedTab === id &&
                  "text-talearnt_Text_02 shadow-[inset_0_-2px_0_0] shadow-talearnt_Primary_01"
              )}
              onClick={() => setSelectedTab(id)}
              type="button"
              key={id}
              aria-label={`${label} 탭${showDot ? "(읽지 않은 알림 있음)" : ""}`}
            >
              <span className={"relative"}>
                {label}
                {showDot && (
                  <Dot
                    className={classNames(
                      "absolute -right-2 top-0",
                      "h-[6px] w-[6px] bg-talearnt_Primary_01"
                    )}
                  />
                )}
              </span>
            </button>
          );
        })}
      </div>
      {filtered.length > 0 && (
        <div className={classNames("flex justify-between", "px-6")}>
          {["모두 읽기", "모두 삭제"].map((label, index) => (
            <button
              className={classNames(
                "px-3 py-[11px]",
                "text-body3_14_medium text-talearnt_Primary_01"
              )}
              onClick={() =>
                index === 0
                  ? markAsRead.mutate(unreadNotificationNos)
                  : setPrompt({
                      title: "알림 모두 삭제",
                      content:
                        "모든 알림을 삭제하시겠어요? 삭제한 알림은 되돌릴 수 없어요.",
                      confirmOnClickHandler: async () => {
                        await deleteNotification.mutateAsync(notificationNos);
                        setToast({
                          message: "알림이 삭제되었습니다",
                          type: "success",
                        });
                      },
                      cancelOnClickHandler: () => setPrompt(),
                    })
              }
              key={label}
              type="button"
            >
              {label}
            </button>
          ))}
        </div>
      )}
      {isLoading ? (
        // TODO 스켈레톤 추가
        <div
          className={
            "py-8 text-center text-body2_16_semibold text-talearnt_Text_03"
          }
        >
          불러오는 중...
        </div>
      ) : filtered.length === 0 ? (
        <div className={"flex-1"}>
          <EmptyState
            className={"h-full justify-center"}
            title={"새로운 알림이 없어요"}
            description={`탤런트의 ${
              selectedTab === "all"
                ? "댓글과 관심 키워드"
                : selectedTab === "comment"
                  ? "댓글"
                  : "관심 키워드"
            } 알림을\n이곳에서 모아볼 수 있어요`}
            iconSize={200}
            icon={"mako"}
          />
        </div>
      ) : (
        <div
          ref={listRef}
          className={classNames(
            "flex flex-col gap-3",
            "scrollbar scrollbar-w10-8 overflow-y-scroll pl-6"
          )}
        >
          {filtered.map(
            ({
              content,
              createdAt,
              isRead,
              notificationNo,
              notificationType,
              senderNickname,
              talentCodes,
              targetNo,
              unreadCount,
            }) => (
              <button
                className={classNames(
                  "flex justify-between gap-4",
                  "rounded-lg border border-talearnt_Line_02 bg-talearnt_BG_Background p-[15px]",
                  !isRead && "bg-talearnt_PrimaryBG_04"
                )}
                onClick={() => {
                  if (!isRead) {
                    markAsRead.mutate([notificationNo]);
                  }

                  if (notificationType === "관심 키워드") {
                    if (pathname !== `/matching-article/${targetNo}`) {
                      navigator(`/matching-article/${targetNo}`);
                    }
                  } else if (pathname !== `/community-article/${targetNo}`) {
                    navigator(`/community-article/${targetNo}`);
                  }

                  onClose();
                }}
                key={notificationNo}
                type="button"
                aria-label={`${senderNickname} · ${typeof notificationType === "string" ? notificationType : "알림"}`}
              >
                <div className={classNames("flex flex-col", "text-left")}>
                  <div
                    className={classNames(
                      "flex items-center gap-[6px]",
                      "mb-1"
                    )}
                  >
                    <span
                      className={
                        "text-body3_14_medium text-talearnt_Primary_01"
                      }
                    >
                      {notificationType}
                    </span>
                    <Dot className={"bg-talearnt_Icon_03"} />
                    <span
                      className={"text-body3_14_medium text-talearnt_Text_03"}
                    >
                      {formatRelativeTime(createdAt)}
                    </span>
                  </div>
                  <p
                    className={
                      "break-keep text-body2_16_medium text-talearnt_Text_01"
                    }
                  >
                    {notificationType === "관심 키워드"
                      ? `${findTalentList(talentCodes)
                          .map(({ talentName }) => `'${talentName}'`)
                          .join(", ")}관련 매칭이 올라왔어요!`
                      : `${senderNickname}님이 ${notificationType}을 달았어요!`}
                  </p>
                  <p
                    className={
                      "overflow-hidden text-ellipsis break-all text-body2_16_medium text-talearnt_Text_01"
                    }
                  >
                    {content}
                  </p>
                </div>
                <div
                  className={
                    "flex flex-shrink-0 flex-col items-end justify-between"
                  }
                >
                  <CloseIcon
                    onClick={e => {
                      e.stopPropagation();
                      deleteNotification.mutate([notificationNo]);
                    }}
                    size={20}
                    aria-label={"알림 삭제"}
                  />
                  {unreadCount > 1 && (
                    <span
                      className={classNames(
                        "rounded-[99px] bg-talearnt_Primary_01 px-2 py-[3px]",
                        "text-caption1_14_medium text-talearnt_On_Success"
                      )}
                    >
                      {unreadCount > 99 ? "99+" : unreadCount}
                    </span>
                  )}
                </div>
              </button>
            )
          )}
        </div>
      )}
    </div>
  );
}

export { Notifications };
