import { classNames } from "@utils/classNames";

import { CommonIconProps } from "@common/common.type";

function Spinner({ className, size = 25, ...props }: CommonIconProps) {
  return (
    <svg
      className={classNames("animate-spin", className)}
      width={size}
      height={size}
      viewBox="0 0 25 25"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M24.8984 12.8981C24.8984 19.5254 19.5259 24.8978 12.8984 24.8978C6.27102 24.8978 0.898438 19.5254 0.898438 12.8981C0.898438 6.27088 6.27102 0.898438 12.8984 0.898438C19.5259 0.898438 24.8984 6.27088 24.8984 12.8981ZM4.48676 12.8981C4.48676 17.5437 8.25279 21.3096 12.8984 21.3096C17.5441 21.3096 21.3101 17.5437 21.3101 12.8981C21.3101 8.25261 17.5441 4.48666 12.8984 4.48666C8.25279 4.48666 4.48676 8.25261 4.48676 12.8981Z"
        fill="url(#paint0_angular_2313_43727)"
      />
      <ellipse cx="13.0188" cy="23.0968" rx="1.8" ry="1.79995" fill="#1B76FF" />
      <defs>
        <radialGradient
          id="paint0_angular_2313_43727"
          cx="0"
          cy="0"
          r="1"
          gradientUnits="userSpaceOnUse"
          gradientTransform="translate(12.8984 12.8981) rotate(90) scale(11.9997 12)"
        >
          <stop stopColor="#1B76FF" />
          <stop offset="0.175675" stopColor="#4C94FF" />
          <stop offset="1" stopColor="#E5F0FF" stopOpacity="0.5" />
        </radialGradient>
      </defs>
    </svg>
  );
}

export { Spinner };
