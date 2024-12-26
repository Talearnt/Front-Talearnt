import { classNames } from "@utils/classNames";

import { CommonIconProps } from "@common/common.type";

/**
 * X 아이콘
 * 색 변경은 className에 "stroke-talearnt-Primary_01" 와 같이 넣어주면 됨
 * size 변경은 원하는 size를 넣어주면 됨
 *
 * @param {string | undefined} className
 * @param {number | undefined} size
 * @param {Omit<CommonIconProps, "scale" | "className">} props
 * @constructor
 */

function CloseIcon({ className, size = 24, ...props }: CommonIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={classNames(
        "cursor-pointer stroke-talearnt-Icon_01",
        className
      )}
      {...props}
    >
      <path
        d="M22 2L12 12M12 12L2 22M12 12L22 22M12 12L2 2"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

export { CloseIcon };
