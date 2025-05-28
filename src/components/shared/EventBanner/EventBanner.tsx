import { Link } from "react-router-dom";

import dayjs from "dayjs";

type EventBannerProps = {
  bannerUrl: string;
  to: string;
  startDate: string;
  endDate?: string;
};

function EventBanner({ bannerUrl, to, startDate, endDate }: EventBannerProps) {
  return (
    <div className={"flex flex-col gap-2"}>
      <Link className={"h-full w-full overflow-hidden rounded-xl"} to={to}>
        <img className={"h-full w-full"} src={bannerUrl} alt={"이벤트 배너"} />
      </Link>
      <div className={"flex justify-between"}>
        <span className={"text-caption1_14_medium text-talearnt_Primary_01"}>
          {!endDate || dayjs().isBefore(endDate) ? "진행중" : "종료"}
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
