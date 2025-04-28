import {
  forwardRef,
  ReactElement,
  Ref,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState
} from "react";

type SliderProps = {
  children: ReactElement[];
  gap?: number; // 슬라이드 간 간격 (px)
  autoplay?: boolean; // 자동 재생 여부
  autoplayTime?: number; // 자동 재생 간격 (ms)
  infinite?: boolean; // 무한 슬라이드 여부
  speed?: number; // 슬라이드 전환 속도 (ms)
  slidesToShow?: number; // 한 번에 보여줄 슬라이드 수
  onIndexChange?: (index: number) => void; // 인덱스 변경 콜백
  onAutoSlidingActive?: (isAutoSlidingActive: boolean) => void; // 자동 재생 상태 변경 콜백
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
      infinite,
      onIndexChange,
      onAutoSlidingActive
    }: SliderProps,
    ref: Ref<SliderRefType>
  ) => {
    const autoplayRef = useRef<NodeJS.Timeout | null>(null);

    const [currentIndex, setCurrentIndex] = useState(1);
    const [isSliding, setIsSliding] = useState(false);
    const [isAutoSlidingActive, setIsAutoSlidingActive] = useState(false);

    const clonedSlides = useMemo(
      () => [
        ...children.slice(-slidesToShow),
        ...children,
        ...children.slice(0, slidesToShow)
      ],
      [children, slidesToShow]
    );
    const totalSlides = children.length;

    // 다음 슬라이드로 이동
    const setNextIndex = useCallback(
      () =>
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
        }),
      [slidesToShow, speed, totalSlides]
    );
    // 자동 재생 시작
    const startAutoplay = useCallback(() => {
      setIsAutoSlidingActive(true);
      // 슬라이드 로직 실행
      autoplayRef.current = setInterval(
        () =>
          setIsSliding(() => {
            // 슬라이드 로직 실행
            setNextIndex();

            // 애니메이션 완료 후 isSliding을 false로 설정
            setTimeout(() => setIsSliding(false), speed);

            return true; // isSliding을 true로 설정
          }),
        autoplayTime
      );
    }, [autoplayTime, setNextIndex, speed]);
    // 자동 재생 정지
    const stopAutoplay = useCallback(() => {
      if (autoplayRef.current) {
        setIsSliding(false);
        setIsAutoSlidingActive(false);
        clearInterval(autoplayRef.current);
        autoplayRef.current = null;
      }
    }, []);
    // 이전 슬라이드로 이동
    const goToPrev = useCallback(
      () =>
        setIsSliding(currentlySliding => {
          // 이미 슬라이딩 중이거나 첫 번째 슬라이드에서 무한스크롤이 아닌 경우
          if (
            (currentlySliding || (currentIndex === 1 && !infinite)) &&
            !autoplayRef.current
          ) {
            return currentlySliding; // 상태 변경하지 않음
          }

          // 슬라이드 로직 실행
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

          if (autoplayRef.current) {
            stopAutoplay();
          }

          // 애니메이션 완료 후 isSliding을 false로 설정
          setTimeout(() => setIsSliding(false), speed);

          return true; // isSliding을 true로 설정
        }),
      [currentIndex, infinite, slidesToShow, speed, stopAutoplay, totalSlides]
    );
    // 다음 슬라이드로 이동
    const goToNext = useCallback(
      () =>
        setIsSliding(currentlySliding => {
          if (
            (currentlySliding ||
              (Math.ceil(currentIndex) * slidesToShow >= totalSlides &&
                !infinite)) &&
            !autoplayRef.current
          ) {
            return currentlySliding;
          }

          // 슬라이드 로직 실행
          setNextIndex();

          if (autoplayRef.current) {
            stopAutoplay();
          }

          // 애니메이션 완료 후 isSliding을 false로 설정
          setTimeout(() => setIsSliding(false), speed);

          return true; // isSliding을 true로 설정
        }),
      [
        currentIndex,
        infinite,
        setNextIndex,
        slidesToShow,
        speed,
        stopAutoplay,
        totalSlides
      ]
    );

    useImperativeHandle(
      ref,
      () => ({
        play: startAutoplay,
        pause: stopAutoplay,
        next: goToNext,
        previous: goToPrev
      }),
      [goToNext, goToPrev, startAutoplay, stopAutoplay]
    );
    // 자동 재생 적용
    useEffect(() => {
      if (autoplay) {
        startAutoplay();
      }

      return () => stopAutoplay();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [autoplay]);
    // 인덱스 변경 롤백 적용
    useEffect(() => {
      if (onIndexChange) {
        onIndexChange(currentIndex);
      }
    }, [currentIndex, onIndexChange]);
    // 자동 재생 상태 변경 롤백 적용
    useEffect(() => {
      if (onAutoSlidingActive) {
        onAutoSlidingActive(isAutoSlidingActive);
      }
    }, [isAutoSlidingActive, onAutoSlidingActive]);

    return (
      <div
        className={"overflow-hidden"}
        style={{ margin: gap ? `0 -${gap / 2}px` : undefined }}
      >
        <div
          className={"flex"}
          style={{
            transform: `translate3d(-${currentIndex * 100}%, 0, 0)`,
            transition: isSliding ? `transform ${speed}ms ease-in-out` : "none"
          }}
        >
          {clonedSlides.map((item, index) => (
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
