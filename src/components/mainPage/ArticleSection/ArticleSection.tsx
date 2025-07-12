import { ReactElement, ReactNode } from "react";
import { useNavigate } from "react-router-dom";

import { classNames } from "@shared/utils/classNames";

import { useCarousel } from "@shared/hooks/useCarousel";

import { useAuthStore } from "@store/user.store";

import { Button } from "@components/common/Button/Button";
import { CaretIcon } from "@components/common/icons/caret/CaretIcon";
import { MakoWithPencil } from "@components/common/icons/mako/MakoWithPencil";
import { MoveButton } from "@components/mainPage/MoveButton/MoveButton";

interface ArticleSectionProps {
  children: ReactElement[];
  title: ReactNode;
  articleType?: "matching" | "community";
}

export function ArticleSection({
  children,
  title,
  articleType = "matching",
}: ArticleSectionProps) {
  const navigator = useNavigate();

  const isLoggedIn = useAuthStore(state => state.isLoggedIn);

  const { emblaRef, canScrollPrev, canScrollNext, scrollPrev, scrollNext } =
    useCarousel({
      carouselOptions: {
        align: "start",
        slidesToScroll: 2,
      },
      trackButtonStates: true,
    });

  const hasChildren = children.length > 0;
  const type = articleType === "community" ? "커뮤니티" : "매칭";

  return (
    <div className={"flex flex-col gap-6"}>
      <div className={"flex items-center justify-between"}>
        <span className={"text-heading1_30_semibold text-talearnt_Text_Strong"}>
          {hasChildren ? title : `아직 ${type} 게시물이 없어요`}
        </span>
        <div className={"flex gap-4"}>
          <button
            className={classNames(
              "group",
              "rounded-full border border-talearnt_Line_01 bg-talearnt_BG_Background",
              "hover:shadow-shadow_02 disabled:opacity-50"
            )}
            onClick={scrollPrev}
            disabled={!canScrollPrev || !hasChildren}
          >
            <CaretIcon
              className={
                "group-hover:stroke-talearnt_Icon_01 group-disabled:cursor-not-allowed group-disabled:stroke-talearnt_Icon_03"
              }
              direction={"left"}
              size={40}
            />
          </button>
          <button
            className={classNames(
              "group",
              "rounded-full border border-talearnt_Line_01 bg-talearnt_BG_Background",
              "hover:shadow-shadow_02 disabled:opacity-50"
            )}
            onClick={scrollNext}
            disabled={!canScrollNext || !hasChildren}
          >
            <CaretIcon
              className={
                "group-hover:stroke-talearnt_Icon_01 group-disabled:cursor-not-allowed group-disabled:stroke-talearnt_Icon_03"
              }
              size={40}
            />
          </button>
        </div>
      </div>
      {hasChildren ? (
        <>
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
            text={`${articleType === "community" ? "커뮤니티" : "매칭"} 게시물 더 보기`}
            to={articleType}
          />
        </>
      ) : (
        <div className={classNames("flex flex-col items-center", "py-10")}>
          <span
            className={classNames(
              "mb-1",
              "text-heading2_24_semibold text-talearnt_Text_01"
            )}
          >
            첫 {type} 게시물을 작성해 보세요!
          </span>
          <span
            className={classNames(
              "mb-6",
              "text-body2_16_medium text-talearnt_Text_02"
            )}
          >
            탤런트가 여러분의 게시물을 기다리고 있어요
          </span>
          <MakoWithPencil className={"mb-6"} size={200} />
          <Button
            className={"w-[400px]"}
            onClick={() =>
              navigator(isLoggedIn ? "write-article/matching" : "sign-in")
            }
          >
            게시물 작성하기
          </Button>
        </div>
      )}
    </div>
  );
}
