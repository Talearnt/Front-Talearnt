import { classNames } from "@utils/classNames";

import { CommonIconProps } from "@common/common.type";

/**
 * 알림 아이콘
 * size 변경은 원하는 size를 넣어주면 됨
 *
 * @param {string | undefined} className
 * @param {number | undefined} size
 * @param {Omit<CommonIconProps, "scale" | "className">} props
 * @constructor
 */

function NotificationIcon({ className, size = 24, ...props }: CommonIconProps) {
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
      <path
        d="M9 20.9899C9.79613 21.618 10.8475 22 12 22C13.1525 22 14.2039 21.618 15 20.9899M3.57109 17.7575C3.09677 17.7575 2.83186 17.0216 3.11877 16.6127C3.78453 15.6639 4.42712 14.2724 4.42712 12.5967L4.45458 10.1685C4.45458 5.65717 7.83278 2 12 2C16.2286 2 19.6566 5.71104 19.6566 10.2888L19.6291 12.5967C19.6291 14.2839 20.2495 15.683 20.8882 16.6322C21.164 17.0421 20.8984 17.7575 20.43 17.7575H3.57109Z"
        stroke="stroke-talearnt-gray-800"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export { NotificationIcon };
