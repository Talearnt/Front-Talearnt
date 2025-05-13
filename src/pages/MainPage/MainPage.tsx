import { useNavigate } from "react-router-dom";

import { classNames } from "@utils/classNames";

import { useCarousel, useCarouselProps } from "@hook/useCarousel";
import { useGetProfile } from "@hook/user.hook";
import {
  useGetHotCommunityArticleList,
  useGetPersonalizedMatchingArticleList,
  useGetRecentMatchingArticleList
} from "@pages/MainPage/core/mainPage.hook";

import { MatchingArticleCard } from "@pages/articles/MatchingArticleList/components/MatchingArticleCard/MatchingArticleCard";
import { CommunityArticleCard } from "@pages/MainPage/components/CommunityArticleCard/CommunityArticleCard";
import { MoreArticleButton } from "@pages/MainPage/components/MoreArticleButton/MoreArticleButton";

import { CaretIcon } from "@components/icons/caret/CaretIcon/CaretIcon";

const CAROUSEL_OPTIONS: useCarouselProps = {
  carouselOptions: {
    align: "start",
    slidesToScroll: 2
  },
  trackButtonStates: true
};

function MainPage() {
  const navigator = useNavigate();

  const bannerCarousel = useCarousel({
    autoplay: true,
    autoplayOptions: { delay: 5000 },
    carouselOptions: { loop: true },
    trackIndexStates: true
  });
  const personalizedMatchingCarousel = useCarousel(CAROUSEL_OPTIONS);
  const recentMatchingCarousel = useCarousel(CAROUSEL_OPTIONS);
  const bestCommunityCarousel = useCarousel(CAROUSEL_OPTIONS);

  const {
    data: {
      data: { nickname }
    }
  } = useGetProfile();
  const {
    data: {
      data: { results: personalizedMatchingArticleList }
    },
    isSuccess
  } = useGetPersonalizedMatchingArticleList();
  const {
    data: {
      data: { results: recentMatchingArticleList }
    }
  } = useGetRecentMatchingArticleList();
  const {
    data: {
      data: { results: hotCommunityArticleList }
    }
  } = useGetHotCommunityArticleList();

  return (
    <div className={classNames("flex flex-col gap-14", "pt-10")}>
      {/* 배너 */}
      <div className={classNames("relative")}>
        <div className={"overflow-hidden"} ref={bannerCarousel.emblaRef}>
          <div className={"flex"}>
            {Array.from({ length: 3 }).map((_, index) => (
              <div
                className={classNames(
                  "flex-shrink-0 flex-grow-0 basis-full",
                  "mr-5 min-w-0"
                )}
                key={`banner-${index}`}
              >
                <div
                  className={classNames(
                    "flex items-center justify-center",
                    "h-[300px] rounded-[20px] bg-[#1B76FF]",
                    "text-heading1_30_semibold text-talearnt_On_Primary"
                  )}
                >
                  배너 {index + 1}
                </div>
              </div>
            ))}
          </div>
        </div>
        <div
          className={classNames(
            "absolute bottom-4 left-1/2 -translate-x-1/2",
            "flex items-center gap-[10px]"
          )}
        >
          <span className={"text-body3_14_semibold text-talearnt_Text_02"}>
            {bannerCarousel.currentIndex + 1}/3
          </span>
          <button onClick={bannerCarousel.toggleAutoplay}>
            {bannerCarousel.isAutoPlaying ? <PauseIcon /> : <StartIcon />}
          </button>
        </div>
        <CaretIcon
          className={classNames(
            "absolute left-[-25px] top-1/2 -translate-y-1/2",
            "rounded-full bg-talearnt_BG_Background stroke-talearnt_Icon_01 shadow-shadow_03"
          )}
          onClick={bannerCarousel.scrollPrev}
          direction={"left"}
          size={50}
        />
        <CaretIcon
          className={classNames(
            "absolute right-[-25px] top-1/2 -translate-y-1/2",
            "rounded-full bg-talearnt_BG_Background stroke-talearnt_Icon_01 shadow-shadow_03"
          )}
          onClick={bannerCarousel.scrollNext}
          size={50}
        />
      </div>
      {/* 맞춤 매칭 게시물 목록 */}
      {isSuccess && (
        <div className={classNames("flex flex-col gap-6")}>
          <div className={"flex items-center justify-between"}>
            <span
              className={"text-heading1_30_semibold text-talearnt_Text_Strong"}
            >
              <span className={"text-talearnt_Primary_01"}>{nickname}</span>님을
              위한 맞춤 매칭
            </span>
            <div className={"flex gap-4"}>
              <button
                className={classNames(
                  "group",
                  "rounded-full border border-talearnt_Line_01 bg-talearnt_BG_Background",
                  "hover:shadow-shadow_02",
                  !personalizedMatchingCarousel.canScrollPrev && "opacity-50"
                )}
                onClick={personalizedMatchingCarousel.scrollPrev}
                disabled={!personalizedMatchingCarousel.canScrollPrev}
              >
                <CaretIcon
                  className={
                    "group-hover:stroke-talearnt_Icon_01 group-disabled:cursor-not-allowed group-disabled:group-hover:stroke-talearnt_Icon_03"
                  }
                  direction={"left"}
                  size={42}
                />
              </button>
              <button
                className={classNames(
                  "group",
                  "rounded-full border border-talearnt_Line_01 bg-talearnt_BG_Background",
                  "hover:shadow-shadow_02",
                  !personalizedMatchingCarousel.canScrollNext && "opacity-50"
                )}
                onClick={personalizedMatchingCarousel.scrollNext}
                disabled={!personalizedMatchingCarousel.canScrollNext}
              >
                <CaretIcon
                  className={
                    "group-hover:stroke-talearnt_Icon_01 group-disabled:cursor-not-allowed group-disabled:group-hover:stroke-talearnt_Icon_03"
                  }
                  size={42}
                />
              </button>
            </div>
          </div>
          <div
            className={"overflow-hidden"}
            ref={personalizedMatchingCarousel.emblaRef}
          >
            <div className={classNames("flex", "-ml-5")}>
              {personalizedMatchingArticleList.map(
                ({ exchangePostNo, ...article }, index) => (
                  <div
                    className={classNames(
                      "flex-shrink-0 flex-grow-0 basis-1/4",
                      "min-w-0 pl-5"
                    )}
                    key={`banner-${index}`}
                  >
                    <MatchingArticleCard
                      {...article}
                      onClickHandler={() =>
                        navigator(`/matching-article/${exchangePostNo}`)
                      }
                      exchangePostNo={exchangePostNo}
                      key={exchangePostNo}
                    />
                  </div>
                )
              )}
            </div>
          </div>
          <MoreArticleButton
            onClick={() => navigator("matching")}
            type={"matching"}
          />
        </div>
      )}
      {/* 신규 매칭 게시물 목록 */}
      <div className={classNames("flex flex-col gap-6")}>
        <div className={"flex items-center justify-between"}>
          <span
            className={"text-heading1_30_semibold text-talearnt_Text_Strong"}
          >
            신규 매칭 게시물이 올라왔어요!
          </span>
          <div className={"flex gap-4"}>
            <button
              className={classNames(
                "group",
                "rounded-full border border-talearnt_Line_01 bg-talearnt_BG_Background",
                "hover:shadow-shadow_02",
                !recentMatchingCarousel.canScrollPrev && "opacity-50"
              )}
              onClick={recentMatchingCarousel.scrollPrev}
              disabled={!recentMatchingCarousel.canScrollPrev}
            >
              <CaretIcon
                className={
                  "group-hover:stroke-talearnt_Icon_01 group-disabled:cursor-not-allowed group-disabled:group-hover:stroke-talearnt_Icon_03"
                }
                direction={"left"}
                size={42}
              />
            </button>
            <button
              className={classNames(
                "group",
                "rounded-full border border-talearnt_Line_01 bg-talearnt_BG_Background",
                "hover:shadow-shadow_02",
                !recentMatchingCarousel.canScrollNext && "opacity-50"
              )}
              onClick={recentMatchingCarousel.scrollNext}
              disabled={!recentMatchingCarousel.canScrollNext}
            >
              <CaretIcon
                className={
                  "group-hover:stroke-talearnt_Icon_01 group-disabled:cursor-not-allowed group-disabled:group-hover:stroke-talearnt_Icon_03"
                }
                size={42}
              />
            </button>
          </div>
        </div>
        <div
          className={"overflow-hidden"}
          ref={recentMatchingCarousel.emblaRef}
        >
          <div className={classNames("flex", "-ml-5")}>
            {recentMatchingArticleList.map(
              ({ exchangePostNo, ...article }, index) => (
                <div
                  className={classNames(
                    "flex-shrink-0 flex-grow-0 basis-1/4",
                    "min-w-0 pl-5"
                  )}
                  key={`banner-${index}`}
                >
                  <MatchingArticleCard
                    {...article}
                    onClickHandler={() =>
                      navigator(`/matching-article/${exchangePostNo}`)
                    }
                    exchangePostNo={exchangePostNo}
                    key={exchangePostNo}
                  />
                </div>
              )
            )}
          </div>
        </div>
        <MoreArticleButton
          onClick={() => navigator("matching")}
          type={"matching"}
        />
      </div>
      {/* 신규 커뮤니티 게시물 목록 */}
      <div className={classNames("flex flex-col gap-6")}>
        <div className={"flex items-center justify-between"}>
          <span
            className={"text-heading1_30_semibold text-talearnt_Text_Strong"}
          >
            신규 커뮤니티 게시물이 올라왔어요!
          </span>
          <div className={"flex gap-4"}>
            <button
              className={classNames(
                "group",
                "rounded-full border border-talearnt_Line_01 bg-talearnt_BG_Background",
                "hover:shadow-shadow_02",
                !bestCommunityCarousel.canScrollPrev && "opacity-50"
              )}
              onClick={bestCommunityCarousel.scrollPrev}
              disabled={!bestCommunityCarousel.canScrollPrev}
            >
              <CaretIcon
                className={
                  "group-hover:stroke-talearnt_Icon_01 group-disabled:cursor-not-allowed group-disabled:group-hover:stroke-talearnt_Icon_03"
                }
                direction={"left"}
                size={42}
              />
            </button>
            <button
              className={classNames(
                "group",
                "rounded-full border border-talearnt_Line_01 bg-talearnt_BG_Background",
                "hover:shadow-shadow_02",
                !bestCommunityCarousel.canScrollNext && "opacity-50"
              )}
              onClick={bestCommunityCarousel.scrollNext}
              disabled={!bestCommunityCarousel.canScrollNext}
            >
              <CaretIcon
                className={
                  "group-hover:stroke-talearnt_Icon_01 group-disabled:cursor-not-allowed group-disabled:group-hover:stroke-talearnt_Icon_03"
                }
                size={42}
              />
            </button>
          </div>
        </div>
        <div className={"overflow-hidden"} ref={bestCommunityCarousel.emblaRef}>
          <div className={classNames("flex", "-ml-5")}>
            {hotCommunityArticleList.map(
              ({ communityPostNo, ...article }, index) => (
                <div
                  className={classNames(
                    "flex-shrink-0 flex-grow-0 basis-1/4",
                    "min-w-0 pl-5"
                  )}
                  key={`banner-${index}`}
                >
                  <CommunityArticleCard
                    {...article}
                    onClickHandler={() =>
                      navigator(`/community-article/${communityPostNo}`)
                    }
                    index={index}
                    key={index}
                  />
                </div>
              )
            )}
          </div>
        </div>
        <MoreArticleButton
          onClick={() => navigator("community")}
          type={"community"}
        />
      </div>
    </div>
  );
}

function StartIcon() {
  return (
    <svg
      width="30"
      height="30"
      viewBox="0 0 30 30"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M2 15C2 7.8203 7.8203 2 15 2C22.1797 2 28 7.8203 28 15C28 22.1797 22.1797 28 15 28C7.8203 28 2 22.1797 2 15Z"
        fill="black"
        fillOpacity="0.2"
      />
      <path
        d="M18.9133 14.4096C19.6941 14.8327 19.697 15.3649 18.9133 15.8432L12.8579 19.8136C12.097 20.2084 11.5803 19.9753 11.526 19.1211L11.5003 10.811C11.4832 10.0242 12.1498 9.80189 12.7851 10.1791L18.9133 14.4096Z"
        stroke="white"
        strokeWidth="1.4"
      />
    </svg>
  );
}

function PauseIcon() {
  return (
    <svg
      width="30"
      height="30"
      viewBox="0 0 30 30"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M2 15C2 7.8203 7.8203 2 15 2C22.1797 2 28 7.8203 28 15C28 22.1797 22.1797 28 15 28C7.8203 28 2 22.1797 2 15Z"
        fill="black"
        fillOpacity="0.2"
      />
      <path
        d="M11.9998 19.5V10.5M17.9998 19.5V10.5"
        stroke="white"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default MainPage;
