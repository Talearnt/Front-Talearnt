import { classNames } from "@utils/classNames";

import { CommonIconProps } from "@/common/common.type";

/**
 * 동그란 체크 아이콘
 * size 변경은 scale에 배수를 넣어주면 됨
 *
 * @param {string | undefined} className
 * @param {number | undefined} scale
 * @param {Omit<CommonIconProps, "scale" | "className">} props
 * @returns {JSX.Element}
 * @constructor
 */
function CircleCheckIcon({ className, scale = 1, ...props }: CommonIconProps) {
  const size = scale * 24;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={classNames(className)}
      {...props}
    >
      <circle
        cx="12"
        cy="12"
        r="11.3"
        stroke="stroke-talearnt-gray-500"
        strokeWidth="1.4"
      />
      <path
        d="M7 12L10.5 15L16.5 10"
        stroke="stroke-talearnt-gray-500"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export { CircleCheckIcon };
