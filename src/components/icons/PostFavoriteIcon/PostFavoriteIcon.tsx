import { classNames } from "@utils/classNames";

import { CommonIconProps } from "@common/common.type";

type PostFavoriteIconProps = CommonIconProps & {
  isFavorite?: boolean;
};

function PostFavoriteIcon({
  className,
  isFavorite,
  size = 28,
  ...props
}: PostFavoriteIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 28 28"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={classNames(
        "cursor-pointer",
        isFavorite ? "fill-talearnt_Primary_01" : "fill-talearnt_BG_Background",
        isFavorite ? "stroke-talearnt_Primary_01" : "stroke-talearnt_Icon_03",
        className
      )}
      {...props}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M3.75143 5.82622C4.87321 4.70478 6.39447 4.07478 7.98067 4.07478C9.56686 4.07478 11.0881 4.70478 12.2099 5.82622L13.9626 7.57743L15.7153 5.82622C16.2671 5.25488 16.9272 4.79916 17.657 4.48565C18.3868 4.17215 19.1718 4.00713 19.9661 4.00023C20.7604 3.99332 21.5481 4.14468 22.2832 4.44545C23.0184 4.74623 23.6863 5.19041 24.2479 5.75207C24.8096 6.31373 25.2538 6.98163 25.5545 7.71679C25.8553 8.45195 26.0067 9.23965 25.9998 10.0339C25.9929 10.8282 25.8279 11.6132 25.5143 12.343C25.2008 13.0728 24.7451 13.7329 24.1738 14.2847L13.9626 24.4974L3.75143 14.2847C2.62999 13.1629 2 11.6416 2 10.0555C2 8.46925 2.62999 6.948 3.75143 5.82622Z"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export { PostFavoriteIcon };
