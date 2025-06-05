import { classNames } from "@shared/utils/classNames";

import {
  styledIconVariants,
  StyledIconVariantsProps,
} from "@components/common/icons/icon.type";

function AccountIcon({
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
        d="M12 13.2559C14.406 13.2559 16.55 13.7144 18.0664 14.4258C19.6384 15.1633 20.2998 16.0439 20.2998 16.7783C20.2996 17.6155 19.8296 18.4643 18.5283 19.1426C17.2036 19.833 15.0818 20.2998 12 20.2998C8.91818 20.2998 6.79637 19.833 5.47168 19.1426C4.17037 18.4643 3.70036 17.6155 3.7002 16.7783C3.7002 16.0439 4.36157 15.1633 5.93359 14.4258C7.44999 13.7144 9.59404 13.2559 12 13.2559ZM12 3.7002C13.6714 3.7002 15.1182 5.30321 15.1182 7.00977C15.1181 8.68278 13.7031 10.1748 12 10.1748C10.2969 10.1748 8.8819 8.68279 8.88184 7.00977C8.88184 5.30321 10.3286 3.7002 12 3.7002Z"
        strokeWidth="1.4"
      />
    </svg>
  );
}

export { AccountIcon };
