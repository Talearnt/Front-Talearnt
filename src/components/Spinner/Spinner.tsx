import { classNames } from "@utils/classNames";

import { CommonIconProps } from "@common/common.type";

function Spinner({ className, size = 25, ...props }: CommonIconProps) {
  return (
    <svg
      className={classNames("animate-spinner_spin", className)}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <g clipPath="url(#clip0_2964_49837)">
        <path
          d="M22.5 12C23.3284 12 24.0098 11.3251 23.9075 10.503C23.1707 4.58207 18.1205 0 12 0C5.37258 0 0 5.37258 0 12C0 18.1205 4.58207 23.1707 10.503 23.9075C11.3251 24.0098 12 23.3284 12 22.5C12 21.6716 11.3234 21.0131 10.5063 20.8766C6.24662 20.1651 3 16.4617 3 12C3 7.02944 7.02944 3 12 3C16.4617 3 20.1651 6.24662 20.8766 10.5063C21.0131 11.3234 21.6716 12 22.5 12Z"
          fill="url(#paint0_linear_2964_49837)"
        />
      </g>
      <defs>
        <linearGradient
          id="paint0_linear_2964_49837"
          x1="29"
          y1="1"
          x2="5.5"
          y2="24"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0.0977082" stopColor="white" stopOpacity="0.1" />
          <stop offset="0.727498" stopColor="#4C94FF" />
          <stop offset="1" stopColor="#1B76FF" />
        </linearGradient>
        <clipPath id="clip0_2964_49837">
          <rect width="24" height="24" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
}

export { Spinner };
