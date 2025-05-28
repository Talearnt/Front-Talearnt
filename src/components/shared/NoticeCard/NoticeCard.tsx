import dayjs from "dayjs";

import { classNames } from "@shared/utils/classNames";

import { Badge } from "@components/common/Badge/Badge";

type NoticeCardProps = {
  noticeType: string;
  title: string;
  content: string;
  createdAt: string;
  pageType?: "main" | "notice";
};

function NoticeCard({
  noticeType,
  title,
  content,
  createdAt,
  pageType = "main"
}: NoticeCardProps) {
  return (
    <div
      className={classNames(
        "flex flex-col gap-2",
        "rounded-2xl border border-talearnt_Line_01 p-[23px]"
      )}
    >
      <div className={"flex gap-1"}>
        <Badge label={noticeType} />
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
