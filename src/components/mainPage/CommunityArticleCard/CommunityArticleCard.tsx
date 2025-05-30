import dayjs from "dayjs";

import { classNames } from "@shared/utils/classNames";

import { Badge } from "@components/common/Badge/Badge";
import { ChatIcon } from "@components/common/icons/ChatIcon/ChatIcon";
import { ThumbsUpIcon } from "@components/common/icons/ThumbsUpIcon/ThumbsUpIcon";
import { ViewsIcon } from "@components/common/icons/ViewsIcon/ViewsIcon";
import { Avatar } from "@components/shared/Avatar/Avatar";

import { communityArticleType } from "@features/articles/communityArticleList/communityArticleList.type";

function CommunityArticleCard({
  commentCount,
  content,
  count,
  createdAt,
  index,
  isLike,
  likeCount,
  nickname,
  onClickHandler,
  postType,
  profileImg,
  title,
  updatedAt
}: Omit<communityArticleType, "communityPostNo"> & {
  onClickHandler?: () => void;
  index: number;
}) {
  return (
    <div
      className={classNames(
        "flex flex-col gap-6",
        "cursor-pointer rounded-2xl border border-talearnt_Line_01 bg-talearnt_BG_Background p-[23px]",
        "hover:border-talearnt_Primary_01"
      )}
      onClick={onClickHandler}
    >
      <div className={"flex items-center"}>
        <Avatar imageUrl={profileImg} size={40} />
        <div className={classNames("flex flex-col", "ml-2")}>
          <span className={"text-body2_16_semibold text-talearnt_Text_Strong"}>
            {nickname}
          </span>
          <span className={"text-caption2_12_medium text-talearnt_Text_03"}>
            {dayjs(updatedAt ?? createdAt).format("YYYY-MM-DD")}
          </span>
        </div>
        <ThumbsUpIcon className={"ml-auto"} isPressed={isLike} size={28} />
      </div>
      <div className={"flex flex-col gap-2"}>
        <div className={"flex gap-1"}>
          <Badge label={`Best ${index + 1}`} type={"error"} />
          <Badge label={postType} />
        </div>
        <h2
          className={classNames(
            "h-[57.2px]",
            "line-clamp-2 text-heading3_22_semibold text-talearnt_Text_Strong"
          )}
        >
          {title}
        </h2>
        <p
          className={classNames(
            "h-[36.4px]",
            "line-clamp-2 text-body3_14_medium text-talearnt_Text_03"
          )}
        >
          {content}
        </p>
      </div>
      <div
        className={classNames(
          "flex items-center",
          "border-t border-talearnt_Line_01 pt-4"
        )}
      >
        <div className={"flex items-center gap-1"}>
          <ThumbsUpIcon
            className={"fill-talearnt_Icon_04 stroke-talearnt_Icon_04"}
            size={24}
          />
          <span className={"text-caption1_14_medium text-talearnt_Text_03"}>
            {likeCount}
          </span>
        </div>
        <div className={classNames("flex items-center gap-1", "ml-2")}>
          <ChatIcon />
          <span className={"text-caption1_14_medium text-talearnt_Text_03"}>
            {commentCount}
          </span>
        </div>
        <div className={classNames("flex items-center gap-1", "ml-auto")}>
          <ViewsIcon />
          <span className={"text-caption1_14_medium text-talearnt_Text_03"}>
            {count}
          </span>
        </div>
      </div>
    </div>
  );
}

export { CommunityArticleCard };
