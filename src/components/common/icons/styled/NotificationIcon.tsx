import { classNames } from "@shared/utils/classNames";

import {
  styledIconVariants,
  StyledIconVariantsProps,
} from "@components/common/icons/icon.type";

function NotificationIcon({
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
        d="M9 20.5404C9.79613 21.1371 10.8475 21.5 12 21.5C13.1525 21.5 14.2039 21.1371 15 20.5404M3.57109 17.4697C3.09677 17.4697 2.83186 16.7705 3.11877 16.3821C3.78453 15.4807 4.42712 14.1588 4.42712 12.5668L4.45458 10.2601C4.45458 5.97431 7.83278 2.5 12 2.5C16.2286 2.5 19.6566 6.02549 19.6566 10.3744L19.6291 12.5668C19.6291 14.1697 20.2495 15.4989 20.8882 16.4006C21.164 16.79 20.8984 17.4697 20.43 17.4697H3.57109Z"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export { NotificationIcon };
