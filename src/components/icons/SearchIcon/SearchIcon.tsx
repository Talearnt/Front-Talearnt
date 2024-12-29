import { classNames } from "@utils/classNames";

import { CommonIconProps } from "@common/common.type";

/**
 * 돋보기 아이콘
 * 색 변경은 className에 "stroke-talearnt-Icon_01" 와 같이 넣어주면 됨
 * size 변경은 원하는 size를 넣어주면 됨
 *
 * @param {string | undefined} className
 * @param {number | undefined} size
 * @param {Omit<CommonIconProps, "scale" | "className">} props
 * @constructor
 */

function SearchIcon({ className, size = 24, ...props }: CommonIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={classNames("stroke-talearnt-Icon_03", className)}
      {...props}
    >
      <path
        d="M16.6922 16.8L20 20M18.9333 11.4667C18.9333 15.5904 15.5904 18.9333 11.4667 18.9333C7.34294 18.9333 4 15.5904 4 11.4667C4 7.34294 7.34294 4 11.4667 4C15.5904 4 18.9333 7.34294 18.9333 11.4667Z"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
    </svg>
  );
}

export { SearchIcon };
