import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { useShallow } from "zustand/shallow";

import { classNames } from "@shared/utils/classNames";

import {
  useGetEventList,
  useGetNoticeList,
} from "@features/eventNotice/eventNotice.hook";

import {
  useEventPageStore,
  useNoticePageStore,
} from "@features/eventNotice/eventNotice.store";

import { EmptyState } from "@components/common/EmptyState/EmptyState";
import { Pagination } from "@components/common/Pagination/Pagination";
import { TabSlider } from "@components/common/TabSlider/TabSlider";
import { EventBanner } from "@components/shared/EventBanner/EventBanner";
import { NoticeCard } from "@components/shared/NoticeCard/NoticeCard";
import { SkeletonEventBanner } from "@components/shared/SkeletonEventBanner/SkeletonEventBanner";
import { SkeletonNoticeCard } from "@components/shared/SkeletonNoticeCard/SkeletonNoticeCard";

import { eventNoticeTabOptions } from "@features/eventNotice/eventNotice.constants";

import { eventNoticeTabType } from "@features/eventNotice/eventNotice.type";

function EventNoticeList() {
  const { tab } = useParams();
  const navigator = useNavigate();

  const [selectedTab, setSelectedTab] = useState<eventNoticeTabType>(
    (tab as eventNoticeTabType | undefined) || "event"
  );

  const eventPageStore = useEventPageStore(
    useShallow(state => ({
      page: state.page,
      setPage: state.setPage,
    }))
  );
  const noticePageStore = useNoticePageStore(
    useShallow(state => ({
      page: state.page,
      setPage: state.setPage,
    }))
  );

  // 이벤트 목록
  const {
    data: { data: eventList },
    isLoading: isEventLoading,
  } = useGetEventList({ enabled: selectedTab === "event" });
  // 공지사항 목록
  const {
    data: { data: noticeList },
    isLoading: isNoticeLoading,
  } = useGetNoticeList({ enabled: selectedTab === "notice" });

  const {
    results,
    pagination: { totalCount, totalPages },
  } = selectedTab === "event" ? eventList : noticeList;
  const { page, setPage } =
    selectedTab === "event" ? eventPageStore : noticePageStore;
  const currentTabLabel = selectedTab === "event" ? "이벤트가" : "공지사항이";
  const isCurrentTabLoading =
    selectedTab === "event" ? isEventLoading : isNoticeLoading;

  const handleTabChange = (value: string) => {
    setSelectedTab(value as eventNoticeTabType);
    navigator(`/event-notice/${value}`);

    if (value === "event") {
      noticePageStore.setPage(1);
    } else {
      eventPageStore.setPage(1);
    }
  };
  const handlePageChange = (page: number) => {
    setPage(page);
    window.scrollTo({ top: 0 });
  };

  useEffect(() => {
    setSelectedTab(tab as eventNoticeTabType);
  }, [tab]);

  return (
    <div className={classNames("flex flex-col", "w-[848px]")}>
      <TabSlider
        currentValue={selectedTab}
        options={eventNoticeTabOptions}
        onClickHandler={handleTabChange}
        type={"shadow"}
      />
      {isCurrentTabLoading ? (
        <>
          <div className={classNames("flex items-center", "my-4 h-10")}>
            <div className="h-6 w-8 animate-pulse rounded-sm bg-talearnt_Icon_04" />
            <div className="ml-1 h-7 w-12 animate-pulse rounded-sm bg-talearnt_Icon_04" />
            <div className="h-6 w-[180px] animate-pulse rounded-sm bg-talearnt_Icon_04" />
          </div>
          {selectedTab === "event" ? (
            <div className={"grid grid-cols-2 gap-x-5 gap-y-6"}>
              {Array.from({ length: 6 }, (_, index) => (
                <SkeletonEventBanner key={index} />
              ))}
            </div>
          ) : (
            <div className={"flex flex-col gap-6"}>
              {Array.from({ length: 6 }, (_, index) => (
                <SkeletonNoticeCard key={index} />
              ))}
            </div>
          )}
        </>
      ) : results.length === 0 ? (
        <div
          className={classNames("grid place-items-center", "mt-6 h-[756px]")}
        >
          <EmptyState
            title={`등록된 ${currentTabLabel} 없어요`}
            description={"좋은 소식을 가져올게요 조금만 기다려 주세요"}
          />
        </div>
      ) : (
        <>
          <div className={classNames("flex items-center", "my-4 h-10")}>
            <span className={"text-heading3_22_semibold text-talearnt_Text_02"}>
              총
            </span>
            <span
              className={classNames(
                "ml-1",
                "text-heading2_24_semibold text-talearnt_Primary_01"
              )}
            >
              {totalCount}
            </span>
            <span className={"text-heading3_22_semibold text-talearnt_Text_02"}>
              개의 {currentTabLabel} 게시물을 작성했어요
            </span>
          </div>
          {selectedTab === "event" ? (
            <div className={"grid grid-cols-2 gap-x-5 gap-y-6"}>
              {eventList.results.map(event => (
                <EventBanner {...event} key={event.eventNo} />
              ))}
            </div>
          ) : (
            <div className={"flex flex-col gap-6"}>
              {noticeList.results.map(notice => (
                <NoticeCard {...notice} type="list" key={notice.noticeNo} />
              ))}
            </div>
          )}
          <Pagination
            className={"mt-14"}
            currentPage={page}
            totalPages={totalPages}
            handlePageChange={handlePageChange}
          />
        </>
      )}
    </div>
  );
}

export default EventNoticeList;
