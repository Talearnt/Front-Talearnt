import { useNavigate } from "react-router-dom";

import dayjs from "dayjs";

import { classNames } from "@shared/utils/classNames";

import { useGetEventDetail } from "@features/eventNotice/eventNotice.hook";

import { Badge } from "@components/common/Badge/Badge";
import { Button } from "@components/common/Button/Button";

function EventDetail() {
  const navigator = useNavigate();

  const {
    data: {
      data: { bannerUrl, content, startDate, endDate, isActive },
    },
  } = useGetEventDetail();

  return (
    <div className={classNames("flex flex-col", "h-full w-[848px] pt-8")}>
      <span
        className={classNames(
          "mb-14",
          "text-center text-heading1_30_semibold text-talearnt_Text_Strong"
        )}
      >
        이벤트
      </span>
      <span
        className={classNames(
          "mb-4",
          "text-heading2_24_semibold text-talearnt_Text_Strong"
        )}
      >
        제목
      </span>
      <div className="flex gap-3">
        <span className={"text-body1_18_medium text-talearnt_Text_04"}>
          {dayjs(startDate).format("YYYY.MM.DD")} ~&nbsp;
          {dayjs(endDate).format("YYYY.MM.DD")}
        </span>
        <Badge
          label={isActive ? "진행중" : "종료"}
          color={isActive ? "skyblue" : "lightgray"}
        />
      </div>
      <div className={"my-6 h-px w-full bg-talearnt_Line_01"} />
      <p className="text-body2_16_semibold text-talearnt_Text_02">{content}</p>
      <img className="mt-6" src={bannerUrl} alt="이벤트 배너" width={"100%"} />
      <div className={"my-14 h-px w-full bg-talearnt_Line_01"} />
      <Button
        className="mx-auto w-[110px]"
        onClick={() => navigator("/event-notice/event")}
      >
        목록으로
      </Button>
    </div>
  );
}

export default EventDetail;
