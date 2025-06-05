import { classNames } from "@shared/utils/classNames";

import {
  styledIconVariants,
  StyledIconVariantsProps,
} from "@components/common/icons/icon.type";

function NoteIcon({
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
        d="M17.5 21H6.5C4.567 21 3 19.433 3 17.5V6.5C3 4.567 4.567 3 6.5 3H17.5C19.433 3 21 4.567 21 6.5V17.5C21 19.433 19.433 21 17.5 21Z"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M6.75 8H17.25"
        stroke={iconType === "outlined" ? "#C1C8CC" : "white"}
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M6.75 12H17.25"
        stroke={iconType === "outlined" ? "#C1C8CC" : "white"}
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M6.75 16H12.25"
        stroke={iconType === "outlined" ? "#C1C8CC" : "white"}
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export { NoteIcon };
