import { useRef } from "react";

import { cx } from "class-variance-authority";

import { classNames } from "@utils/classNames";

import { Slider, SliderRefType } from "@components/Slider/Slider";
const items = ["1", "2", "3", "4", "5", "6", "7"];
function MainPage() {
  const sliderRef = useRef<SliderRefType>(null);
  const play = () => {
    sliderRef.current?.play();
  };
  const pause = () => {
    sliderRef.current?.pause();
  };
  const next = () => {
    sliderRef.current?.next();
  };
  const previous = () => {
    sliderRef.current?.previous();
  };

  return (
    <div className={classNames("flex flex-col gap-14", "w-[1280px] pt-8")}>
      <div>
        <button className={cx("prev")} onClick={play}>
          Play
        </button>
        <button className={cx("next")} onClick={pause}>
          Pause
        </button>
        <button className={cx("prev")} onClick={previous}>
          Previous
        </button>
        <button className={cx("next")} onClick={next}>
          Next
        </button>
      </div>
      <Slider
        ref={sliderRef}
        slidesToShow={5}
        gap={20}
        speed={500}
        infinite
        autoplay
        autoplayTime={200}
      >
        {items.map((item, index) => (
          <div style={{ textAlign: "center" }} key={index}>
            {item}
          </div>
        ))}
      </Slider>
    </div>
  );
}

export default MainPage;
