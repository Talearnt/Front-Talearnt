import { useNavigate } from "react-router-dom";

import dayjs from "dayjs";

import { classNames } from "@shared/utils/classNames";

import { useGetNoticeDetail } from "@features/eventNotice/eventNotice.hook";

import { Badge } from "@components/common/Badge/Badge";
import { Button } from "@components/common/Button/Button";

function NoticeDetail() {
  const navigator = useNavigate();

  const {
    data: {
      data: { content, createdAt, noticeType, title },
    },
  } = useGetNoticeDetail();
  return (
    <div className={classNames("flex flex-col", "h-full w-[848px] pt-8")}>
      <span
        className={classNames(
          "mb-14",
          "text-center text-heading1_30_semibold text-talearnt_Text_Strong"
        )}
      >
        공지사항
      </span>
      <span
        className={classNames(
          "mb-4",
          "text-heading2_24_semibold text-talearnt_Text_Strong"
        )}
      >
        {title}
      </span>
      <div className="flex items-center gap-3">
        <span className={"text-body1_18_medium text-talearnt_Text_04"}>
          {dayjs(createdAt).format("YYYY.MM.DD")}
        </span>
        <Badge label={noticeType} />
      </div>
      <div className={"my-6 h-px w-full bg-talearnt_Line_01"} />
      <p className="text-body2_16_semibold text-talearnt_Text_02">{content}</p>
      <div className={"my-14 h-px w-full bg-talearnt_Line_01"} />
      <Button
        className="mx-auto w-[110px]"
        onClick={() => navigator("/event-notice/notice")}
      >
        목록으로
      </Button>
    </div>
  );
}

export default NoticeDetail;
