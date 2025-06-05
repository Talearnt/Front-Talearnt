import { classNames } from "@shared/utils/classNames";

import {
  styledIconVariants,
  StyledIconVariantsProps,
} from "@components/common/icons/icon.type";

function HeadsetIcon({
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
        d="M21 17H18.4286C17.7185 17 17.1429 16.4201 17.1429 15.7048V13.1143C17.1429 12.3989 17.7185 11.819 18.4286 11.819H21M21 17V17C21 19.4853 18.9853 21.5 16.5 21.5H14.5M21 17V13.9667V10.9333C21 5.92595 16.9706 3 12 3C7.02944 3 3 5.92595 3 10.9333V17H5.57143C6.28151 17 6.85714 16.4201 6.85714 15.7048V13.1143C6.85714 12.3989 6.28151 11.819 5.57143 11.819H3M14.5 21.5H11.5V20.5C11.5 19.9477 11.9477 19.5 12.5 19.5H13.5C14.0523 19.5 14.5 19.9477 14.5 20.5V21.5Z"
        strokeWidth="1.4"
        strokeLinejoin="round"
        fill={"none"}
      />
      <path d="M3 11.8154V16.9964H5.57143C6.28151 16.9964 6.85714 16.4165 6.85714 15.7011V13.1106C6.85714 12.3953 6.28151 11.8154 5.57143 11.8154H3Z" />
      <path d="M20.8594 11.8154V16.9964H18.2879C17.5779 16.9964 17.0022 16.4165 17.0022 15.7011V13.1106C17.0022 12.3953 17.5779 11.8154 18.2879 11.8154H20.8594Z" />
    </svg>
  );
}

export { HeadsetIcon };
