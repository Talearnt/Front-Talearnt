import { classNames } from "@shared/utils/classNames";

import {
  styledIconVariants,
  StyledIconVariantsProps,
} from "@components/common/icons/icon.type";

function HeartIcon({
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
        fillRule="evenodd"
        clipRule="evenodd"
        d="M3.21216 4.95703C4.17369 4.01912 5.47762 3.49223 6.83722 3.49223C8.19682 3.49223 9.50075 4.01912 10.4623 4.95703L11.9646 6.42165L13.4669 4.95703C13.9399 4.4792 14.5057 4.09806 15.1312 3.83586C15.7568 3.57366 16.4296 3.43565 17.1104 3.42988C17.7912 3.4241 18.4664 3.55069 19.0966 3.80224C19.7267 4.05379 20.2992 4.42528 20.7806 4.89502C21.262 5.36476 21.6427 5.92336 21.9006 6.5382C22.1584 7.15305 22.2881 7.81184 22.2822 8.47613C22.2763 9.14042 22.1348 9.79691 21.8661 10.4073C21.5974 11.0177 21.2068 11.5697 20.717 12.0312L11.9646 20.5725L3.21216 12.0312C2.25093 11.093 1.71094 9.82074 1.71094 8.49413C1.71094 7.16752 2.25093 5.89523 3.21216 4.95703V4.95703Z"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export { HeartIcon };
