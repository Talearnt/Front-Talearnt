import { classNames } from "@shared/utils/classNames";

import {
  styledIconVariants,
  StyledIconVariantsProps,
} from "@components/common/icons/icon.type";

function ChatIcon({
  className,
  size = 24,
  iconType,
  ...props
}: StyledIconVariantsProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={classNames(styledIconVariants({ iconType }), className)}
      {...props}
    >
      <path
        d="M20.2338 15.6356C20.7253 14.5238 20.9983 13.2938 20.9983 12C20.9983 7.02944 16.9692 3 11.9991 3C7.02906 3 3 7.02944 3 12C3 16.9706 7.02906 21 11.9991 21C13.5993 21 15.1019 20.5823 16.4039 19.85L21 20.9991L20.2338 15.6356Z"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle
        cx="7"
        cy="12"
        r="1"
        fill={iconType === "outlined" ? "#C1C8CC" : "white"}
        stroke="none"
      />
      <circle
        cx="12"
        cy="12"
        r="1"
        fill={iconType === "outlined" ? "#C1C8CC" : "white"}
        stroke="none"
      />
      <circle
        cx="17"
        cy="12"
        r="1"
        fill={iconType === "outlined" ? "#C1C8CC" : "white"}
        stroke="none"
      />
    </svg>
  );
}

export { ChatIcon };
