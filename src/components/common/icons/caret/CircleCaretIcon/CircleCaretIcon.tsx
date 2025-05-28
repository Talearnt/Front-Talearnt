import { classNames } from "@shared/utils/classNames";

import {
  CaretIconProps,
  caretIconVariants
} from "@components/common/icons/caret/caret.type";

/**
 * 동그란 화살표 아이콘
 * 색 변경은 className에 "stroke-talearnt_Icon_01" 와 같이 넣어주면 됨
 * direction은 화살표가 가르킬 방향
 * size 변경은 원하는 size를 넣어주면 됨
 *
 * @param {string | undefined} className
 * @param {"top" | "right" | "bottom" | "left"} direction
 * @param {number | undefined} size
 * @param {Omit<CaretIconProps, "scale" | "className" | "direction">} props
 * @constructor
 */
function CircleCaretIcon({
  className,
  direction,
  size = 60,
  ...props
}: CaretIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 60 60"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={classNames(caretIconVariants({ direction }), className)}
      {...props}
    >
      <rect
        x="-0.7"
        y="0.7"
        width="58.6"
        height="58.6"
        rx="29.3"
        transform="matrix(-1 0 0 1 58.6 0)"
      />
      <rect
        x="-0.7"
        y="0.7"
        width="58.6"
        height="58.6"
        rx="29.3"
        transform="matrix(-1 0 0 1 58.6 0)"
        strokeWidth="1.4"
      />
      <path
        d="M25 21L34 30L25 39"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export { CircleCaretIcon };
