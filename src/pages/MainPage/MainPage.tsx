import { useNavigate } from "react-router-dom";

import { classNames } from "@utils/classNames";

import { useCarousel } from "@hook/useCarousel";
import { useGetProfile } from "@hook/user.hook";
import {
  useGetBestCommunityArticleList,
  useGetPersonalizedMatchingArticleList,
  useGetRecentMatchingArticleList
} from "@pages/MainPage/core/mainPage.hook";

import { MatchingArticleCard } from "@pages/articles/MatchingArticleList/components/MatchingArticleCard/MatchingArticleCard";
import { ArticleSection } from "@pages/MainPage/components/ArticleSection/ArticleSection";
import { CommunityArticleCard } from "@pages/MainPage/components/CommunityArticleCard/CommunityArticleCard";

import { CaretIcon } from "@components/icons/caret/CaretIcon/CaretIcon";

function MainPage() {
  const navigator = useNavigate();

  const bannerCarousel = useCarousel({
    autoplay: true,
    autoplayOptions: { delay: 5000 },
    carouselOptions: { loop: true },
    trackIndexStates: true
  });

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
      data: { results: bestCommunityArticleList }
    }
  } = useGetBestCommunityArticleList();

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
        <ArticleSection
          title={
            <>
              <span className="text-talearnt_Primary_01">{nickname}</span>님을
              위한 맞춤 매칭
            </>
          }
        >
          {personalizedMatchingArticleList.map(
            ({ exchangePostNo, ...article }) => (
              <MatchingArticleCard
                {...article}
                onClickHandler={() =>
                  navigator(`/matching-article/${exchangePostNo}`)
                }
                exchangePostNo={exchangePostNo}
                key={exchangePostNo}
              />
            )
          )}
        </ArticleSection>
      )}
      {/* 신규 매칭 게시물 목록 */}
      <ArticleSection title={"신규 매칭 게시물이 올라왔어요!"}>
        {recentMatchingArticleList.map(({ exchangePostNo, ...article }) => (
          <MatchingArticleCard
            {...article}
            onClickHandler={() =>
              navigator(`/matching-article/${exchangePostNo}`)
            }
            exchangePostNo={exchangePostNo}
            key={exchangePostNo}
          />
        ))}
      </ArticleSection>
      {/* 신규 커뮤니티 게시물 목록 */}
      <ArticleSection
        title={"신규 커뮤니티 게시물이 올라왔어요!"}
        articleType={"community"}
      >
        {bestCommunityArticleList.map(
          ({ communityPostNo, ...article }, index) => (
            <CommunityArticleCard
              {...article}
              onClickHandler={() =>
                navigator(`/community-article/${communityPostNo}`)
              }
              index={index}
              key={index}
            />
          )
        )}
      </ArticleSection>
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
