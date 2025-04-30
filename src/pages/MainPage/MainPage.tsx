import { useRef, useState } from "react";

import { classNames } from "@utils/classNames";

import { CaretIcon } from "@components/icons/caret/CaretIcon/CaretIcon";
import { Slider, SliderRefType } from "@components/Slider/Slider";

const bannerCount = 3;

function MainPage() {
  const bannerRef = useRef<SliderRefType>(null);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoSlidingActive, setIsAutoSlidingActive] = useState(false);

  return (
    <div className={classNames("flex flex-col gap-14", "pt-10")}>
      {/* 배너 */}
      <div className={classNames("relative")}>
        <Slider
          ref={bannerRef}
          infinite
          onIndexChange={setCurrentIndex}
          onAutoSlidingActive={setIsAutoSlidingActive}
          gap={50}
        >
          {Array.from({ length: bannerCount }).map((_, index) => (
            <div
              className={classNames(
                "flex items-center justify-center",
                "h-[300px] rounded-[20px] bg-[#1B76FF]",
                "text-heading1_30_semibold text-talearnt_On_Primary"
              )}
              key={`banner-${index}`}
            >
              배너 {index + 1}
            </div>
          ))}
        </Slider>
        <div
          className={classNames(
            "absolute bottom-4 left-1/2 -translate-x-1/2",
            "flex items-center gap-[10px]"
          )}
        >
          <span className={"text-body3_14_semibold text-talearnt_Text_02"}>
            {currentIndex > bannerCount
              ? currentIndex - bannerCount
              : currentIndex < 1
                ? bannerCount
                : currentIndex}
            /{bannerCount}
          </span>
          <button
            onClick={() =>
              isAutoSlidingActive
                ? bannerRef.current?.pause()
                : bannerRef.current?.play()
            }
          >
            {isAutoSlidingActive ? <PauseIcon /> : <StartIcon />}
          </button>
        </div>
        {bannerCount > 1 && (
          <>
            <CaretIcon
              className={classNames(
                "absolute left-[-25px] top-1/2 -translate-y-1/2",
                "rounded-full bg-talearnt_BG_Background stroke-talearnt_Icon_01 shadow-shadow_03"
              )}
              onClick={bannerRef.current?.previous}
              direction={"left"}
              size={50}
            />
            <CaretIcon
              className={classNames(
                "absolute right-[-25px] top-1/2 -translate-y-1/2",
                "rounded-full bg-talearnt_BG_Background stroke-talearnt_Icon_01 shadow-shadow_03"
              )}
              onClick={bannerRef.current?.next}
              size={50}
            />
          </>
        )}
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
