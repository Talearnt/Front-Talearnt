import { classNames } from "@utils/classNames";

import { CommonIconProps } from "@common/common.type";

/**
 * 체크 아이콘
 * 색 변경은 className에 "fill-talearnt_Primary_01" 와 같이 넣어주면 됨
 * size 변경은 원하는 size를 넣어주면 됨
 *
 * @param {string | undefined} className
 * @param {number | undefined} size
 * @param {Omit<CommonIconProps, "scale" | "className">} props
 * @constructor
 */

function CompleteIcon({ className, size = 14, ...props }: CommonIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 14 14"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={classNames("fill-talearnt_Primary_01", className)}
      {...props}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12.8 7C12.8 10.2033 10.2033 12.8 7 12.8C3.79675 12.8 1.2 10.2033 1.2 7C1.2 3.79675 3.79675 1.2 7 1.2C10.2033 1.2 12.8 3.79675 12.8 7ZM14 7C14 10.866 10.866 14 7 14C3.13401 14 0 10.866 0 7C0 3.13401 3.13401 0 7 0C10.866 0 14 3.13401 14 7ZM10.3709 6.46889C10.6307 6.26321 10.6746 5.88585 10.4689 5.62604C10.2632 5.36623 9.88584 5.32235 9.62603 5.52803L6.21427 8.22901L4.37731 6.7332C4.12036 6.52396 3.74243 6.56265 3.5332 6.81961C3.32396 7.07656 3.36264 7.45449 3.6196 7.66372L5.83013 9.46372C6.04835 9.64142 6.36076 9.64357 6.5814 9.46889L10.3709 6.46889Z"
      />
    </svg>
  );
}

export { CompleteIcon };
