import { classNames } from "@shared/utils/classNames";

import { CommonIconProps } from "@components/common/icons/icon.type";

/**
 * 동그란 체크 아이콘
 * size 변경은 원하는 size를 넣어주면 됨
 *
 * @param {string | undefined} className
 * @param {number | undefined} size
 * @param {Omit<CommonIconProps, "scale" | "className">} props
 * @constructor
 */
function CircleCheckIcon({ className, size = 24, ...props }: CommonIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={classNames("stroke-talearnt_Icon_03", className)}
      {...props}
    >
      <circle cx="12" cy="12" r="11.3" strokeWidth="1.4" />
      <path
        d="M7 12L10.5 15L16.5 10"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export { CircleCheckIcon };
