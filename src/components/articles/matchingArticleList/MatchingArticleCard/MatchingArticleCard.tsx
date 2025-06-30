import { useEffect, useRef } from "react";

import dayjs from "dayjs";
import { useShallow } from "zustand/shallow";

import { classNames } from "@shared/utils/classNames";
import { findTalentList } from "@shared/utils/findTalent";

import { useMatchingArticleListFilterStore } from "@features/articles/matchingArticleList/matchingArticleList.store";

import { Badge } from "@components/common/Badge/Badge";
import { HeartIcon } from "@components/common/icons/styled/HeartIcon";
import { Avatar } from "@components/shared/Avatar/Avatar";

import { matchingArticleType } from "@features/articles/matchingArticleList/matchingArticleList.type";

function MatchingArticleCard({
  className,
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
  favoriteCount,
  onClickHandler,
}: matchingArticleType & { className?: string; onClickHandler?: () => void }) {
  const giveTalentsRef = useRef<HTMLDivElement>(null);
  const receiveTalentsRef = useRef<HTMLDivElement>(null);

  const {
    giveTalents: filteredGiveTalents,
    receiveTalents: filteredReceiveTalents,
  } = useMatchingArticleListFilterStore(
    useShallow(state => ({
      giveTalents: state.giveTalents,
      receiveTalents: state.receiveTalents,
    }))
  );

  const giveTalentsList = findTalentList(giveTalents);
  const receiveTalentsList = findTalentList(receiveTalents);

  useEffect(() => {
    if (!giveTalentsRef.current || !receiveTalentsRef.current) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries: IntersectionObserverEntry[]) => {
        entries.forEach(entry => {
          if (entry.isIntersecting && entry.target instanceof HTMLElement) {
            const { clientWidth, scrollWidth, lastElementChild } = entry.target;

            if (scrollWidth > clientWidth && lastElementChild) {
              // 재능 목록 잘리는 경우 hover 시 보이도록
              lastElementChild.classList.add("slide-talents");
              (lastElementChild as HTMLDivElement).style.setProperty(
                "--dynamic-translate-x",
                `-${scrollWidth - clientWidth}px`
              );
            }
          }
        });
      },
      {
        threshold: 0.1,
      }
    );

    observer.observe(giveTalentsRef.current);
    observer.observe(receiveTalentsRef.current);

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <div
      className={classNames(
        "group/card",
        "flex flex-col",
        "cursor-pointer rounded-2xl border border-talearnt_Line_01 bg-talearnt_BG_Background p-[23px]",
        "hover:border-talearnt_Primary_01",
        className
      )}
      onClick={onClickHandler}
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
        <HeartIcon
          className={"ml-auto"}
          iconType={isFavorite ? "filled-blue" : "outlined"}
          size={28}
        />
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
      >
        {content}
      </p>
      <div className={classNames("grid grid-cols-2 gap-4", "mb-4")}>
        <div
          ref={giveTalentsRef}
          className={classNames("flex flex-col gap-1", "overflow-x-hidden")}
        >
          <span className={"text-caption2_12_semibold text-talearnt_Text_04"}>
            주고 싶은 재능
          </span>
          <div className={"flex gap-2"}>
            {giveTalentsList.map(({ talentCode, talentName }) => (
              <Badge
                className={classNames(
                  "rounded-md",
                  filteredGiveTalents.includes(talentCode) &&
                    "bg-talearnt_PrimaryBG_01 !text-talearnt_Primary_01"
                )}
                label={talentName}
                type={"keyword"}
                key={`${exchangePostNo}st-card-giveTalent-${talentName}`}
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
          <div className={"flex gap-2"}>
            {receiveTalentsList.map(({ talentCode, talentName }) => (
              <Badge
                className={classNames(
                  "rounded-md",
                  filteredReceiveTalents.includes(talentCode) &&
                    "bg-talearnt_PrimaryBG_01 !text-talearnt_Primary_01"
                )}
                label={talentName}
                type={"keyword"}
                key={`${exchangePostNo}st-card-receiveTalent-${talentName}`}
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
          <HeartIcon iconType={"filled-gray"} />
          <span className={"text-caption1_14_medium text-talearnt_Text_03"}>
            {favoriteCount}
          </span>
        </div>
      </div>
    </div>
  );
}

export { MatchingArticleCard };
