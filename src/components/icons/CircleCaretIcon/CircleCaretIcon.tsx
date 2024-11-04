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
 * 색 변경은 className에 "stroke-talearnt-gray-500" 와 같이 넣어주면 됨
 * direction은 화살표가 가르킬 방향
 * size 변경은 scale에 배수를 넣어주면 됨
 *
 * @param {string | undefined} className
 * @param {"top" | "right" | "bottom" | "left"} direction
 * @param {number | undefined} scale
 * @param {Omit<CaretIconProps, "scale" | "className" | "direction">} props
 * @constructor
 */
function CircleCaretIcon({
  className,
  direction,
  scale = 1,
  ...props
}: CircleCaretIconProps) {
  const size = scale * 30;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 30 30"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={classNames(
        "stroke-talearnt-gray-500",
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
