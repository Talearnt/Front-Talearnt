import { useState } from "react";

import { classNames } from "@shared/utils/classNames";

import { CircleCaretIcon } from "@components/common/icons/caret/CircleCaretIcon/CircleCaretIcon";
import { CloseIcon } from "@components/common/icons/CloseIcon/CloseIcon";
import { ModalContainer } from "@components/common/modal/parts/ModalContainer";

type ImageCarouselProps = {
  title?: string;
  imageUrls: string[];
  clickedIndex: number;
  onCloseHandler: () => void;
};

function ImageCarousel({
  title,
  imageUrls,
  clickedIndex,
  onCloseHandler,
}: ImageCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(clickedIndex);

  return (
    <ModalContainer className={"bg-black/85"}>
      <div
        className={classNames(
          "flex flex-col items-center gap-8",
          "h-full w-full"
        )}
      >
        <header
          className={classNames(
            "relative flex items-center justify-between",
            "h-[90px] w-full px-20"
          )}
        >
          <span
            className={"text-heading3_22_semibold text-talearnt_On_Primary"}
          >
            {title}
          </span>
          <div
            className={
              "absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
            }
          >
            <span className={"text-body1_18_semibold text-talearnt_Primary_01"}>
              {currentIndex + 1}
            </span>
            <span className={"text-body1_18_semibold text-talearnt_On_Primary"}>
              /{imageUrls.length}
            </span>
          </div>
          <CloseIcon
            className={"stroke-talearnt_Icon_03"}
            onClick={onCloseHandler}
          />
        </header>
        <div className={"flex items-center gap-10"}>
          <CircleCaretIcon
            className={classNames(currentIndex === 0 && "cursor-not-allowed")}
            direction={"left"}
            onClick={() => {
              if (currentIndex < 1) {
                return;
              }

              setCurrentIndex(prev => prev - 1);
            }}
          />
          <div
            className={classNames(
              "flex items-center justify-center",
              "h-[calc(100vh-282px)] w-[calc(100vw-328px)]"
            )}
          >
            <img
              className={"max-h-[calc(100vh-282px)] max-w-[calc(100vw-328px)]"}
              src={imageUrls[currentIndex]}
              alt={`${title}게시물 ${currentIndex}번째 사진`}
            />
          </div>
          <CircleCaretIcon
            className={classNames(
              currentIndex === imageUrls.length - 1 && "cursor-not-allowed"
            )}
            onClick={() => {
              if (currentIndex + 1 > imageUrls.length - 1) {
                return;
              }

              setCurrentIndex(prev => prev + 1);
            }}
          />
        </div>
        <div className={"flex gap-4"}>
          {imageUrls.map((src, index) => (
            <div
              className={classNames(
                "h-24 w-24 cursor-pointer rounded-lg",
                index === currentIndex &&
                  "outline outline-2 outline-talearnt_Primary_01"
              )}
              onClick={() => setCurrentIndex(index)}
            >
              <img
                className={"h-full w-full rounded-lg object-cover"}
                src={src}
                alt={`${title}게시물 ${index}번째 사진`}
              />
            </div>
          ))}
        </div>
      </div>
    </ModalContainer>
  );
}

export { ImageCarousel };
