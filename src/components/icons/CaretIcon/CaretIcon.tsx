import { ComponentProps } from "react";

import { cva, VariantProps } from "class-variance-authority";

import { classNames } from "@utils/classNames";

const caretIconVariants = cva("", {
  variants: {
    direction: {
      top: "rotate-180",
      right: "-rotate-90",
      bottom: "rotate-0",
      left: "rotate-90"
    }
  },
  defaultVariants: {
    direction: "bottom"
  }
});

type CaretIconProps = ComponentProps<"svg"> &
  VariantProps<typeof caretIconVariants>;

function CaretIcon({
  className = "stroke-talearnt-gray-500",
  direction,
  ...props
}: CaretIconProps) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={classNames(caretIconVariants({ className, direction }))}
      {...props}
    >
      <path
        d="M16.5 9.5L11.5 14.5L6.5 9.5"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export { CaretIcon };
