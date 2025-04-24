import {
  forwardRef,
  ReactNode,
  Ref,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState
} from "react";

type SliderProps = {
  children: ReactNode[];
  gap?: number;
  autoplay?: boolean;
  autoplayTime?: number;
  infinite?: boolean;
  speed?: number;
  slidesToShow?: number;
};
export type SliderRefType = {
  play: () => void;
  pause: () => void;
  next: () => void;
  previous: () => void;
};

const Slider = forwardRef(
  (
    {
      children,
      gap,
      slidesToShow = 1,
      speed = 500,
      autoplay,
      autoplayTime = 2000,
      infinite
    }: SliderProps,
    ref: Ref<SliderRefType>
  ) => {
    const autoplayRef = useRef<NodeJS.Timeout | null>(null);

    const [currentIndex, setCurrentIndex] = useState(1);
    const [isSliding, setIsSliding] = useState(false);

    const totalSlides = children.length;

    const goToPrev = useCallback(() => {
      if (isSliding || (currentIndex === 1 && !infinite)) {
        // 슬라이딩중이거나, 현재 위치가 1이고 무한 스크롤이 아닌 경우
        return;
      }

      setIsSliding(() => {
        setTimeout(() => setIsSliding(false), speed);

        return true;
      });

      setCurrentIndex(prevIndex => {
        const isFirstSlides = prevIndex === 1;

        if (isFirstSlides) {
          setTimeout(
            () =>
              setCurrentIndex(
                Math.floor(totalSlides / slidesToShow) +
                  (totalSlides % slidesToShow) / slidesToShow
              ),
            speed
          );
        }

        return slidesToShow > 1 && prevIndex % 1 !== 0
          ? Math.floor(prevIndex)
          : prevIndex - 1;
      });
    }, [currentIndex, infinite, isSliding, slidesToShow, speed, totalSlides]);

    const goToNext = useCallback(() => {
      if (
        isSliding ||
        (Math.ceil(currentIndex) * slidesToShow >= totalSlides && !infinite)
      ) {
        return;
      }

      setIsSliding(() => {
        setTimeout(() => setIsSliding(false), speed);

        return true;
      });

      setCurrentIndex(prevIndex => {
        if (Math.ceil(prevIndex) * slidesToShow >= totalSlides) {
          // 이동한 슬라이드 개수가 전체 슬라이드 개수보다 큰 경우 = 클론해놓은 자식까지 슬라이드 한 경우
          setTimeout(() => setCurrentIndex(1), speed);
        }

        return (
          prevIndex +
          (slidesToShow > 1 && // 슬라이드 당 보여주는 개수가 1보다 커야 나머지만 이동하는 경우가 생김
          Math.ceil(prevIndex + 1) * slidesToShow > totalSlides && // 현재 이동하는 곳이 나머지인지 확인
          prevIndex % 1 === 0 // 이미 남은 개수 슬라이드 한경우(index가 정수가 아님)는 100% 이동 해야함
            ? (totalSlides % slidesToShow) / slidesToShow
            : 1)
        );
      });
    }, [currentIndex, infinite, isSliding, slidesToShow, speed, totalSlides]);

    const stopAutoplay = useCallback(() => {
      if (autoplayRef.current) {
        clearInterval(autoplayRef.current);
        autoplayRef.current = null;
      }
    }, []);

    const startAutoplay = useCallback(() => {
      stopAutoplay();
      autoplayRef.current = setInterval(goToNext, autoplayTime);
    }, [autoplayTime, goToNext, stopAutoplay]);

    useImperativeHandle(
      ref,
      () => ({
        play: startAutoplay,
        pause: stopAutoplay,
        next: goToNext,
        previous: goToPrev
      }),
      [startAutoplay, stopAutoplay, goToNext, goToPrev]
    );

    useEffect(() => {
      if (autoplay) {
        startAutoplay();
      }

      return () => stopAutoplay();
    }, [autoplay, startAutoplay, stopAutoplay]);

    return (
      <div
        className={"overflow-hidden border border-black"}
        style={{ margin: gap ? `0 -${gap / 2}px` : undefined }}
      >
        <div
          className={"flex"}
          style={{
            transform: `translate3d(-${currentIndex * 100}%, 0, 0)`,
            transition: isSliding ? `transform ${speed}ms ease-in-out` : "none"
          }}
        >
          {/* 클론 슬라이드 추가 */}
          {[
            ...children.slice(-slidesToShow),
            ...children,
            ...children.slice(0, slidesToShow)
          ].map((item, index) => (
            <div
              className={"shrink-0"}
              style={{
                width: `calc((100% - ${
                  gap ? slidesToShow * gap : 0
                }px) / ${slidesToShow})`,
                margin: gap ? `0 ${gap / 2}px` : undefined
              }}
              key={`slide-${index}`}
            >
              {item}
            </div>
          ))}
        </div>
      </div>
    );
  }
);

export { Slider };
