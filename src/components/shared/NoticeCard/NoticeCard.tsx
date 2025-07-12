import dayjs from "dayjs";

import { classNames } from "@shared/utils/classNames";

import { Badge } from "@components/common/Badge/Badge";

import { noticeType } from "@features/notice/notice.type";

type NoticeCardProps = noticeType & { pageType?: "main" | "notice" };

function NoticeCard({
  noticeType,
  title,
  content,
  createdAt,
  pageType = "main",
}: NoticeCardProps) {
  return (
    <div
      className={classNames(
        "flex flex-col gap-2",
        "rounded-2xl border border-talearnt_Line_01 bg-talearnt_BG_Background p-[23px]"
      )}
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
          pageType === "main" && "line-clamp-2 h-[52px]",
          pageType === "notice" && "line-clamp-1"
        )}
      >
        {title}
      </h2>
      <p
        className={classNames(
          "mb-3",
          "text-body3_14_medium text-talearnt_Text_03",
          pageType === "main" && "line-clamp-2 h-[36.4px]",
          pageType === "notice" && "line-clamp-1"
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
