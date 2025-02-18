import { useCallback, useEffect, useRef } from "react";

import dayjs from "dayjs";

import { classNames } from "@utils/classNames";

import { Avatar } from "@components/Avatar/Avatar";
import { Badge } from "@components/Badge/Badge";
import { PostFavoriteIcon } from "@components/icons/PostFavoriteIcon/PostFavoriteIcon";

import { matchingArticleType } from "@pages/articles/MatchingArticleList/core/matchingArticleList.type";

function MatchingArticleCard({
  exchangePostNo,
  profileImg,
  nickname,
  isFavorite,
  status,
  exchangeType,
  duration,
  title,
  content,
  giveTalents,
  receiveTalents,
  createdAt,
  favoriteCount
}: matchingArticleType) {
  const giveTalentsRef = useRef<HTMLDivElement>(null);
  const receiveTalentsRef = useRef<HTMLDivElement>(null);

  const handleIntersection = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && entry.target instanceof HTMLElement) {
          const { clientWidth, scrollWidth, lastElementChild } = entry.target;

          if (scrollWidth > clientWidth && lastElementChild) {
            // 재능 목록 잘리는 경우 hover 시 보이도록
            lastElementChild.classList.add(
              `hover:translate-x-[-${scrollWidth - clientWidth}px]`
            );
          }
        }
      });
    },
    []
  );

  useEffect(() => {
    if (!giveTalentsRef.current || !receiveTalentsRef.current) {
      return;
    }

    const observer = new IntersectionObserver(handleIntersection, {
      threshold: 0.1
    });

    observer.observe(giveTalentsRef.current);
    observer.observe(receiveTalentsRef.current);

    return () => {
      observer.disconnect();
    };
  }, [handleIntersection]);

  return (
    <div
      className={classNames(
        "flex flex-col",
        "rounded-2xl border border-talearnt_Line_01 p-[23px]"
      )}
    >
      <div className={classNames("flex items-center", "mb-6")}>
        <Avatar imageUrl={profileImg} size={40} />
        <span
          className={classNames(
            "ml-2",
            "text-body2_16_semibold text-talearnt_Text_Strong"
          )}
        >
          {nickname}
        </span>
        <PostFavoriteIcon className={"ml-auto"} isFavorite={isFavorite} />
      </div>
      <div className={classNames("flex gap-1", "mb-2")}>
        <Badge label={status} />
        <Badge label={exchangeType} type={"default"} />
        <Badge label={duration} type={"default"} />
      </div>
      <h2
        className={classNames(
          "mb-2 h-[57.2px]",
          "line-clamp-2 text-heading3_22_semibold text-talearnt_Text_Strong"
        )}
      >
        {title}
      </h2>
      <p
        className={classNames(
          "mb-4 h-[36.4px]",
          "line-clamp-2 text-body3_14_medium text-talearnt_Text_03"
        )}
        dangerouslySetInnerHTML={{ __html: content }}
      />
      <div className={classNames("grid grid-cols-2 gap-4", "mb-4")}>
        <div
          ref={giveTalentsRef}
          className={classNames("flex flex-col gap-1", "overflow-x-hidden")}
        >
          <span className={"text-caption2_12_semibold text-talearnt_Text_04"}>
            주고 싶은 재능
          </span>
          <div
            className={classNames(
              "flex gap-2",
              "transition-transform duration-[1000ms] ease-linear"
            )}
          >
            {giveTalents.map(talentName => (
              <Badge
                label={talentName}
                type={"keyword"}
                key={`${exchangePostNo.toString()}st-card-giveTalent-${talentName}`}
              />
            ))}
          </div>
        </div>
        <div
          ref={receiveTalentsRef}
          className={classNames("flex flex-col gap-1", "overflow-x-hidden")}
        >
          <span className={"text-caption2_12_semibold text-talearnt_Text_04"}>
            받고 싶은 재능
          </span>
          <div
            className={classNames(
              "flex gap-2",
              "transition-transform duration-[1000ms] ease-linear"
            )}
          >
            {receiveTalents.map(talentName => (
              <Badge
                label={talentName}
                type={"keyword"}
                key={`${exchangePostNo.toString()}st-card-receiveTalent-${talentName}`}
              />
            ))}
          </div>
        </div>
      </div>
      <div className={"mb-4 h-px bg-talearnt_Line_01"} />
      <div className={"flex items-center"}>
        <span
          className={classNames(
            "mr-auto",
            "text-caption1_14_medium text-talearnt_Text_03"
          )}
        >
          {dayjs(createdAt).format("YYYY.MM.DD")}
        </span>
        {/*TODO 채팅방 2차 MVP*/}
        {/*<div className={"flex items-center gap-1"}>*/}
        {/*  <span className={"text-caption1_14_medium text-talearnt_Text_03"}>*/}
        {/*    14*/}
        {/*  </span>*/}
        {/*</div>*/}
        <div className={"flex items-center gap-1"}>
          <PostFavoriteIcon
            className={"fill-talearnt_Icon_03 stroke-talearnt_Icon_03"}
          />
          <span className={"text-caption1_14_medium text-talearnt_Text_03"}>
            {favoriteCount}
          </span>
        </div>
      </div>
    </div>
  );
}

export { MatchingArticleCard };
