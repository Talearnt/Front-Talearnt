import { classNames } from "@shared/utils/classNames";

import { CommonIconProps } from "@components/common/icons/icon.type";

/**
 * 에러 아이콘
 * 색 변경은 className에 "fill-talearnt_Error_01" 와 같이 넣어주면 됨
 * size 변경은 원하는 size를 넣어주면 됨
 *
 * @param {string | undefined} className
 * @param {number | undefined} size
 * @param {Omit<CommonIconProps, "scale" | "className">} props
 * @constructor
 */

function ErrorIcon({ className, size = 14, ...props }: CommonIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 14 14"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={classNames("fill-talearnt_Error_01", className)}
      {...props}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12.8 7C12.8 10.2033 10.2033 12.8 7 12.8C3.79675 12.8 1.2 10.2033 1.2 7C1.2 3.79675 3.79675 1.2 7 1.2C10.2033 1.2 12.8 3.79675 12.8 7ZM14 7C14 10.866 10.866 14 7 14C3.13401 14 0 10.866 0 7C0 3.13401 3.13401 0 7 0C10.866 0 14 3.13401 14 7Z"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M7.59844 3.49844C7.59844 3.16707 7.32981 2.89844 6.99844 2.89844C6.66707 2.89844 6.39844 3.16707 6.39844 3.49844V6.99844C6.39844 7.32981 6.66707 7.59844 6.99844 7.59844C7.32981 7.59844 7.59844 7.32981 7.59844 6.99844V3.49844ZM7.59844 9.59268C7.59844 9.2613 7.32981 8.99268 6.99844 8.99268C6.66707 8.99268 6.39844 9.2613 6.39844 9.59268V9.62344C6.39844 9.95481 6.66707 10.2234 6.99844 10.2234C7.32981 10.2234 7.59844 9.95481 7.59844 9.62344V9.59268Z"
      />
    </svg>
  );
}

export { ErrorIcon };
