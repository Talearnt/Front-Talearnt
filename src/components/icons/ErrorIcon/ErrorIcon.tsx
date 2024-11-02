import { classNames } from "@utils/classNames";

import { CommonIconProps } from "@/common/common.type";

/**
 * 에러 아이콘
 * 색 변경은 className에 "stroke-talearnt-Error_01" 와 같이 넣어주면 됨
 * size 변경은 scale에 배수를 넣어주면 됨
 *
 * @param {string | undefined} className
 * @param {number | undefined} scale
 * @param {Omit<CommonIconProps, "scale" | "className">} props
 * @returns {JSX.Element}
 * @constructor
 */

function ErrorIcon({ className, scale = 1, ...props }: CommonIconProps) {
  const size = scale * 16;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={classNames("stroke-talearnt-Error_01", className)}
      {...props}
    >
      <path
        d="M8 8V4.5M8 10.5942V10.625M15 8C15 11.866 11.866 15 8 15C4.13401 15 1 11.866 1 8C1 4.13401 4.13401 1 8 1C11.866 1 15 4.13401 15 8Z"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export { ErrorIcon };
