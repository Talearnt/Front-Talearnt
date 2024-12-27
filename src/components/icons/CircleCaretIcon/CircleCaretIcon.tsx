import { cva } from "class-variance-authority";

import { classNames } from "@utils/classNames";

import { CommonIconProps, CustomVariantProps } from "@common/common.type";

type CircleCaretIconVariantsType = Record<
  "direction",
  Record<"top" | "right" | "bottom" | "left", string>
>;

type CircleCaretIconProps = CommonIconProps &
  CustomVariantProps<CircleCaretIconVariantsType>;

const circleCaretIconVariants = cva<CircleCaretIconVariantsType>("", {
  variants: {
    direction: {
      top: "-rotate-90",
      right: "rotate-0",
      bottom: "rotate-90",
      left: "rotate-180"
    }
  },
  defaultVariants: {
    direction: "right"
  }
});

/**
 * 동그란 화살표 아이콘
 * 색 변경은 className에 "stroke-talearnt-Icon_01" 와 같이 넣어주면 됨
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
}: CircleCaretIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 30 30"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={classNames(
        "stroke-talearnt-Icon_01",
        circleCaretIconVariants({ className, direction })
      )}
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
