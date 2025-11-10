import { useState } from "react";

import { classNames } from "@shared/utils/classNames";

import {
  useGetEventList,
  useGetNoticeList,
} from "@features/eventNotice/eventNotice.hook";

import { Button } from "@components/common/Button/Button";
import { MoveButton } from "@components/mainPage/MoveButton/MoveButton";
import { EventBanner } from "@components/shared/EventBanner/EventBanner";
import { NoticeCard } from "@components/shared/NoticeCard/NoticeCard";
import { SkeletonEventBanner } from "@components/shared/SkeletonEventBanner/SkeletonEventBanner";
import { SkeletonNoticeCard } from "@components/shared/SkeletonNoticeCard/SkeletonNoticeCard";

import { eventNoticeTabOptions } from "@features/eventNotice/eventNotice.constants";

import { eventNoticeTabType } from "@features/eventNotice/eventNotice.type";

function EventNoticeTabSection() {
  const [selectedTab, setSelectedTab] = useState<eventNoticeTabType>("event");

  // 공지사항 목록
  const {
    data: {
      data: { results: noticeList },
    },
    isSuccess: isNoticeListSuccess,
    isLoading: isNoticeListLoading,
    isError: isNoticeListError,
    refetch: refetchNoticeList,
  } = useGetNoticeList({ enabled: selectedTab === "notice", size: 4 });
  // 이벤트 목록
  const {
    data: {
      data: { results: eventList },
    },
    isSuccess: isEventListSuccess,
    isLoading: isEventListLoading,
    isError: isEventListError,
    refetch: refetchEventList,
  } = useGetEventList({ enabled: selectedTab === "event", size: 2 });

  const isLoading =
    selectedTab === "event" ? isEventListLoading : isNoticeListLoading;
  const isError =
    selectedTab === "event" ? isEventListError : isNoticeListError;
  const refetch =
    selectedTab === "event" ? refetchEventList : refetchNoticeList;
  const hasList =
    selectedTab === "event"
      ? eventList.length > 0 && isEventListSuccess
      : noticeList.length > 0 && isNoticeListSuccess;

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
          {eventNoticeTabOptions.map(({ label, value }, index) => (
            <label
              className={classNames(
                "flex items-center",
                "h-[50px] rounded-full border border-talearnt_Line_01 bg-talearnt_BG_Background px-[23px]",
                "text-body1_18_medium text-talearnt_Text_02",
                "cursor-pointer",
                selectedTab === value &&
                  "border-talearnt_Primary_01 bg-talearnt_Primary_01 text-talearnt_On_Primary",
                !!index && "ml-4"
              )}
              key={value}
            >
              <input
                className={"hidden"}
                checked={selectedTab === value}
                onChange={() => setSelectedTab(value)}
                name={"tab"}
                value={value}
                type={"radio"}
              />
              {label}
            </label>
          ))}
          <MoveButton
            className={"mr-0 rounded-none"}
            to={`/event-notice/${selectedTab}`}
            text={"전체 보기"}
          />
        </div>
        {isLoading ? (
          <div
            className={classNames(
              "grid gap-4",
              selectedTab === "event" && "grid-cols-2 grid-rows-[248px]",
              selectedTab === "notice" &&
                "grid-cols-[repeat(4,214px)] grid-rows-[214px]"
            )}
          >
            {selectedTab === "event" &&
              Array.from({ length: 2 }).map((_, index) => (
                <SkeletonEventBanner key={index} />
              ))}
            {selectedTab === "notice" &&
              Array.from({ length: 4 }).map((_, index) => (
                <SkeletonNoticeCard key={index} />
              ))}
          </div>
        ) : isError ? (
          <div
            className={"flex flex-1 flex-col items-center justify-center gap-4"}
          >
            <p className={"text-heading2_24_semibold text-talearnt_Text_01"}>
              {selectedTab === "event" ? "이벤트" : "공지사항"}를 불러오는 중
              오류가 발생했어요
            </p>
            <p className={"text-body2_16_medium text-talearnt_Text_02"}>
              잠시 후 다시 시도해 주세요
            </p>
            <Button onClick={() => refetch()} buttonStyle={"outlined"}>
              다시 시도
            </Button>
          </div>
        ) : hasList ? (
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
                <NoticeCard {...notice} type="main" key={notice.noticeNo} />
              ))}
          </div>
        ) : (
          <div
            className={"flex flex-1 flex-col items-center justify-center gap-1"}
          >
            <p className={"text-heading2_24_semibold text-talearnt_Text_01"}>
              등록된 {selectedTab === "event" ? "이벤트가" : "공지사항이"}&nbsp;
              없어요
            </p>
            <p className={"text-body2_16_medium text-talearnt_Text_02"}>
              좋은 {selectedTab === "event" ? "이벤트를" : "공지사항을"}&nbsp;
              가져올게요 조금만 기다려 주세요
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export { EventNoticeTabSection };
