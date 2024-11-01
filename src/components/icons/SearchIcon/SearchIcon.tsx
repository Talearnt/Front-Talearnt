import { classNames } from "@utils/classNames";

import { CommonIconProps } from "@/common/common.type";

/**
 * 돋보기 아이콘
 * 색 변경은 className에 "stroke-talearnt-gray-500" 와 같이 넣어주면 됨
 * size 변경은 scale에 배수를 넣어주면 됨
 *
 * @param {string | undefined} className
 * @param {number | undefined} scale
 * @param {Omit<CommonIconProps, "scale" | "className">} props
 * @returns {JSX.Element}
 * @constructor
 */

function SearchIcon({ className, scale = 1, ...props }: CommonIconProps) {
  const size = scale * 24;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={classNames("stroke-talearnt-primary", className)}
      {...props}
    >
      <path
        d="M17.3269 17.44L20.8 20.8M19.68 11.84C19.68 16.1699 16.1699 19.68 11.84 19.68C7.51009 19.68 4 16.1699 4 11.84C4 7.51009 7.51009 4 11.84 4C16.1699 4 19.68 7.51009 19.68 11.84Z"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

export { SearchIcon };
