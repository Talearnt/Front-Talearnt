import { classNames } from "@utils/classNames";

import {
  CaretIconProps,
  caretIconVariants
} from "@components/icons/caret/caret.type";

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
  size = 30,
  ...props
}: CaretIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 30 30"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={classNames(caretIconVariants({ direction }), className)}
      {...props}
    >
      <circle cx="15" cy="15" r="14.3" strokeWidth="1.4" />
      <path
        d="M13 9L19 15L13 21"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export { CircleCaretIcon };
