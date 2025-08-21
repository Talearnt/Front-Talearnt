import { useState } from "react";

import { classNames } from "@shared/utils/classNames";

import { useGetEventList } from "@features/event/event.hook";
import { useGetNoticeList } from "@features/notice/notice.hook";

import { MoveButton } from "@components/mainPage/MoveButton/MoveButton";
import { EventBanner } from "@components/shared/EventBanner/EventBanner";
import { NoticeCard } from "@components/shared/NoticeCard/NoticeCard";

type tabType = "event" | "notice";

const tabs: { id: tabType; label: string }[] = [
  { id: "event", label: "이벤트" },
  { id: "notice", label: "공지사항" },
];

function NoticeEventTabSection() {
  const [selectedTab, setSelectedTab] = useState<tabType>("event");

  // 공지사항 목록
  const {
    data: {
      data: { results: noticeList },
    },
  } = useGetNoticeList({ enabled: selectedTab === "notice", size: 4 });
  // 이벤트 목록
  const {
    data: {
      data: { results: eventList },
    },
  } = useGetEventList({ enabled: selectedTab === "event", size: 2 });

  return (
    <div
      className={classNames(
        "flex justify-between",
        "h-[402px] rounded-[20px] bg-talearnt_BG_Up_01 p-10"
      )}
    >
      <span
        className={classNames(
          "flex-shrink-0",
          "text-heading1_30_semibold text-talearnt_Text_Strong"
        )}
      >
        탤런트의 최신 소식을
        <br />
        확인해 보세요!
      </span>
      <div className={classNames("flex flex-col gap-6", "w-[904px]")}>
        <div className={"flex"}>
          {tabs.map(({ id, label }, index) => (
            <label
              className={classNames(
                "flex items-center",
                "h-[50px] rounded-full border border-talearnt_Line_01 bg-talearnt_BG_Background px-[23px]",
                "text-body1_18_medium text-talearnt_Text_02",
                "cursor-pointer",
                selectedTab === id &&
                  "border-talearnt_Primary_01 bg-talearnt_Primary_01 text-talearnt_On_Primary",
                !!index && "ml-4"
              )}
              key={id}
            >
              <input
                className={"hidden"}
                checked={selectedTab === id}
                onChange={() => setSelectedTab(id)}
                name={"tab"}
                value={id}
                type={"radio"}
              />
              {label}
            </label>
          ))}
          <MoveButton
            className={"mr-0 rounded-none"}
            to={`/notice-event/${selectedTab}`}
            text={"전체 보기"}
          />
        </div>
        <div
          className={classNames(
            "grid gap-4",
            selectedTab === "event" && "grid-cols-2 grid-rows-[248px]",
            selectedTab === "notice" &&
              "grid-cols-[repeat(4,214px)] grid-rows-[214px]"
          )}
        >
          {selectedTab === "event" &&
            eventList.map(event => (
              <EventBanner {...event} key={event.eventNo} />
            ))}
          {selectedTab === "notice" &&
            noticeList.map(notice => (
              <NoticeCard {...notice} key={notice.noticeNo} />
            ))}
        </div>
      </div>
    </div>
  );
}

export { NoticeEventTabSection };
