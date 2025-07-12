import { Link } from "react-router-dom";

import dayjs from "dayjs";

import { classNames } from "@shared/utils/classNames";

import { eventType } from "@features/event/event.type";

function EventBanner({
  eventNo,
  bannerUrl,
  isActive,
  startDate,
  endDate,
}: eventType) {
  return (
    <div className={"flex flex-col gap-2"}>
      <Link
        className={"h-full w-full overflow-hidden rounded-xl"}
        to={`/notice-event/event/${eventNo}`}
      >
        <img className={"h-full w-full"} src={bannerUrl} alt={"이벤트 배너"} />
      </Link>
      <div className={"flex justify-between"}>
        <span
          className={classNames(
            "text-caption1_14_medium",
            isActive ? "text-talearnt_Primary_01" : "text-talearnt_Text_03"
          )}
        >
          {isActive ? "진행중" : "종료"}
        </span>
        <span className={"text-caption1_14_medium text-talearnt_Text_03"}>
          {endDate
            ? `${dayjs(startDate).format("YYYY.MM.DD")} ~ ${dayjs(endDate).format("YYYY.MM.DD")}`
            : "상시 진행"}
        </span>
      </div>
    </div>
  );
}

export { EventBanner };
