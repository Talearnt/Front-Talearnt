import { classNames } from "@shared/utils/classNames";

import {
  CaretIconProps,
  caretIconVariants,
} from "@components/common/icons/icon.type";

/**
 * 꼬리 없는 화살표 아이콘
 * 색 변경은 className에 "stroke-talearnt_Icon_03" 와 같이 넣어주면 됨
 * direction은 화살표가 가르킬 방향
 * size 변경은 원하는 size를 넣어주면 됨
 *
 * @param {string | undefined} className
 * @param {"top" | "right" | "bottom" | "left"} direction
 * @param {number | undefined} size
 * @param {Omit<CaretIconProps, "scale" | "className" | "direction">} props
 * @constructor
 */
function CaretIcon({
  className,
  direction,
  size = 24,
  ...props
}: CaretIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={classNames(caretIconVariants({ direction }), className)}
      {...props}
    >
      <path
        d="M9.5 7L14.5 12L9.5 17"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export { CaretIcon };
