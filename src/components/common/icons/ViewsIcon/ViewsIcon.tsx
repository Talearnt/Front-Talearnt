import { classNames } from "@shared/utils/classNames";

import { CommonIconProps } from "@components/common/icons/icon.type";

function ViewsIcon({ className, size = 24, ...props }: CommonIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={classNames(
        "fill-talearnt_Icon_03 stroke-talearnt_Icon_03",
        className
      )}
      {...props}
    >
      <path
        d="M12 19.2841C19.6282 19.4089 22 12.2668 22 12.2668C22 12.2668 19.7244 5 12 5C4.27564 5 2 12.2668 2 12.2668C2 12.2668 4.37179 19.1593 12 19.2841Z"
        strokeWidth="1.4"
      />
      <path
        d="M14.5032 12.1771C14.5032 13.5206 13.3839 14.6098 12.0032 14.6098C10.6225 14.6098 9.50317 13.5206 9.50317 12.1771C9.50317 10.8336 10.6225 9.74445 12.0032 9.74445C13.3839 9.74445 14.5032 10.8336 14.5032 12.1771Z"
        fill="white"
        stroke="white"
        strokeWidth="1.4"
      />
    </svg>
  );
}

export { ViewsIcon };
