import { classNames } from "@shared/utils/classNames";

import { useCarousel } from "@shared/hooks/useCarousel";

import { CaretIcon } from "@components/common/icons/caret/CaretIcon";

import banner from "@assets/banner.png";

const caretIconClass = classNames(
  "absolute top-1/2 -translate-y-1/2",
  "rounded-full bg-talearnt_BG_Background stroke-talearnt_Icon_01 shadow-shadow_03"
);

function BannerCarousel() {
  const bannerList = [banner];
  const isMultiple = bannerList.length > 1;

  const {
    emblaRef,
    currentIndex,
    isAutoPlaying,
    scrollPrev,
    scrollNext,
    toggleAutoplay,
  } = useCarousel({
    autoplay: isMultiple,
    autoplayOptions: { playOnInit: false, delay: 500 },
    carouselOptions: { loop: isMultiple },
    trackIndexStates: isMultiple,
  });

  return (
    <div className={"relative"}>
      <div className={"overflow-hidden"} ref={emblaRef}>
        <div className={"flex"}>
          {bannerList.map((src, index) => (
            <img
              className={classNames(
                "flex-shrink-0 flex-grow-0 basis-full",
                "min-w-0 rounded-[20px]",
                "cursor-pointer",
                isMultiple && "mr-5"
              )}
              src={src}
              alt={`banner-${index}`}
              onClick={() =>
                window.open(
                  "https://www.notion.so/26f4336bc4c080a2b3eaccc4728f3f91",
                  "_blank"
                )
              }
              key={`banner-${index}`}
            />
          ))}
        </div>
      </div>
      {isMultiple && (
        <>
          <div
            className={classNames(
              "absolute bottom-4 left-1/2 -translate-x-1/2",
              "flex items-center gap-[10px]"
            )}
          >
            <span className={"text-body3_14_semibold text-talearnt_Text_02"}>
              {currentIndex + 1}/{bannerList.length}
            </span>
            <button onClick={toggleAutoplay}>
              {isAutoPlaying ? <PauseIcon /> : <StartIcon />}
            </button>
          </div>
          {currentIndex > 0 && (
            <CaretIcon
              className={classNames(caretIconClass, "left-[-25px]")}
              onClick={scrollPrev}
              direction={"left"}
              size={50}
            />
          )}
          {currentIndex < bannerList.length - 1 && (
            <CaretIcon
              className={classNames(caretIconClass, "right-[-25px]")}
              onClick={scrollNext}
              size={50}
            />
          )}
        </>
      )}
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

export { BannerCarousel };
