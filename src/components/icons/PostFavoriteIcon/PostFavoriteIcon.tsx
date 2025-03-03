import { classNames } from "@utils/classNames";

import { CommonIconProps } from "@common/common.type";

type PostFavoriteIconProps = CommonIconProps & {
  isFavorite?: boolean;
};

function PostFavoriteIcon({
  className,
  isFavorite,
  size = 24,
  ...props
}: PostFavoriteIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
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
        d="M3.77256 5.23882C4.67269 4.33896 5.89337 3.83345 7.16616 3.83345C8.43895 3.83345 9.65963 4.33896 10.5598 5.23882L11.9662 6.64402L13.3726 5.23882C13.8153 4.78037 14.345 4.4147 14.9306 4.16313C15.5162 3.91157 16.1461 3.77916 16.7834 3.77362C17.4208 3.76808 18.0528 3.88953 18.6427 4.13088C19.2326 4.37223 19.7686 4.72864 20.2193 5.17932C20.6699 5.63001 21.0264 6.16594 21.2677 6.75584C21.5091 7.34574 21.6305 7.97781 21.625 8.61515C21.6194 9.25249 21.487 9.88234 21.2354 10.468C20.9839 11.0536 20.6182 11.5832 20.1598 12.026L11.9662 20.2208L3.77256 12.026C2.8727 11.1259 2.36719 9.90521 2.36719 8.63242C2.36719 7.35963 2.8727 6.13895 3.77256 5.23882Z"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export { PostFavoriteIcon };
