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

type SearchIconProps = CommonIconProps & {
  strokeColor?: string;
};

function SearchIcon({
  className,
  strokeColor = "stroke-talearnt-BG_Background",
  size = 30,
  ...props
}: SearchIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 30 30"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={classNames("fill-talearnt-Primary_01", className)}
      {...props}
    >
      <rect width="30" height="30" rx="15" />
      <path
        className={strokeColor}
        d="M19.1057 19.2L22 22M21.0667 14.5333C21.0667 18.1416 18.1416 21.0667 14.5333 21.0667C10.9251 21.0667 8 18.1416 8 14.5333C8 10.9251 10.9251 8 14.5333 8C18.1416 8 21.0667 10.9251 21.0667 14.5333Z"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
    </svg>
  );
}

export { SearchIcon };
