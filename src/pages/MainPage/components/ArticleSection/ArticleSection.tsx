import { ReactElement, ReactNode } from "react";
import { useNavigate } from "react-router-dom";

import { classNames } from "@utils/classNames";

import { useCarousel } from "@hook/useCarousel";

import { MoveButton } from "@pages/MainPage/components/MoveButton/MoveButton";

import { CaretIcon } from "@components/icons/caret/CaretIcon/CaretIcon";

interface ArticleSectionProps {
  children: ReactElement[];
  title: ReactNode;
  articleType?: "matching" | "community";
}

export function ArticleSection({
  children,
  title,
  articleType = "matching"
}: ArticleSectionProps) {
  const navigator = useNavigate();

  const { emblaRef, canScrollPrev, canScrollNext, scrollPrev, scrollNext } =
    useCarousel({
      carouselOptions: {
        align: "start",
        slidesToScroll: 2
      },
      trackButtonStates: true
    });

  return (
    <div className={"flex flex-col gap-6"}>
      <div className={"flex items-center justify-between"}>
        <span className={"text-heading1_30_semibold text-talearnt_Text_Strong"}>
          {title}
        </span>
        <div className={"flex gap-4"}>
          <button
            className={classNames(
              "group",
              "rounded-full border border-talearnt_Line_01 bg-talearnt_BG_Background",
              "hover:shadow-shadow_02 disabled:opacity-50"
            )}
            onClick={scrollPrev}
            disabled={!canScrollPrev}
          >
            <CaretIcon
              className={
                "group-hover:stroke-talearnt_Icon_01 group-disabled:cursor-not-allowed group-disabled:stroke-talearnt_Icon_03"
              }
              direction={"left"}
              size={42}
            />
          </button>
          <button
            className={classNames(
              "group",
              "rounded-full border border-talearnt_Line_01 bg-talearnt_BG_Background",
              "hover:shadow-shadow_02 disabled:opacity-50"
            )}
            onClick={scrollNext}
            disabled={!canScrollNext}
          >
            <CaretIcon
              className={
                "group-hover:stroke-talearnt_Icon_01 group-disabled:cursor-not-allowed group-disabled:stroke-talearnt_Icon_03"
              }
              size={42}
            />
          </button>
        </div>
      </div>
      <div className={"overflow-hidden"} ref={emblaRef}>
        <div className={classNames("flex", "-ml-5")}>
          {children.map((component, index) => (
            <div
              className={classNames(
                "flex-shrink-0 flex-grow-0 basis-1/4",
                "min-w-0 pl-5"
              )}
              key={`banner-${index}`}
            >
              {component}
            </div>
          ))}
        </div>
      </div>
      <MoveButton
        onClick={() => navigator(articleType)}
        text={`${articleType === "community" ? "커뮤니티" : "매칭"} 게시물 더 보기`}
      />
    </div>
  );
}
