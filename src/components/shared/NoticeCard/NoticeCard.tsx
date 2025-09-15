import { useNavigate } from "react-router-dom";

import dayjs from "dayjs";

import { classNames } from "@shared/utils/classNames";

import { Badge } from "@components/common/Badge/Badge";

import { noticeType } from "@features/eventNotice/eventNotice.type";

type NoticeCardProps = noticeType & {
  type: "main" | "list";
};

function NoticeCard({
  noticeType,
  title,
  content,
  createdAt,
  noticeNo,
  type,
}: NoticeCardProps) {
  const navigator = useNavigate();

  return (
    <div
      className={classNames(
        "flex flex-col gap-2",
        "rounded-2xl border border-talearnt_Line_01 bg-talearnt_BG_Background p-[23px]",
        "cursor-pointer"
      )}
      onClick={() => navigator(`/event-notice/notice/${noticeNo}`)}
    >
      <div className={"flex gap-1"}>
        <Badge label={noticeType} />
        {dayjs(createdAt).isAfter(dayjs().subtract(1, "week")) && (
          <Badge label={"New"} color={"red"} />
        )}
      </div>
      <h2
        className={classNames(
          "text-heading4_20_semibold text-talearnt_Text_Strong",
          type === "main" && "line-clamp-2 h-[52px]",
          type === "list" && "line-clamp-1"
        )}
      >
        {title}
      </h2>
      <p
        className={classNames(
          "mb-3",
          "text-body3_14_medium text-talearnt_Text_03",
          type === "main" && "line-clamp-2 h-[36.4px]",
          type === "list" && "line-clamp-1"
        )}
      >
        {content}
      </p>
      <span className={"text-caption1_14_medium text-talearnt_Text_03"}>
        {dayjs(createdAt).format("YYYY.MM.DD")}
      </span>
    </div>
  );
}

export { NoticeCard };
