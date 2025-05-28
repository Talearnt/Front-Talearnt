import { classNames } from "@shared/utils/classNames";

import {
  CaretIconProps,
  caretIconVariants
} from "@components/common/icons/caret/caret.type";

/**
 * 꼬리 없는 화살표 두개 아이콘
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
function DoubleCaretIcon({
  className,
  direction,
  size = 20,
  ...props
}: CaretIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={classNames(caretIconVariants({ direction }), className)}
      {...props}
    >
      <path
        d="M10.5 14.5L14.5 10L10.5 5.5M5.5 14.5L9.5 10L5.5 5.5"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export { DoubleCaretIcon };
