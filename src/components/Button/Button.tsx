import { ComponentProps } from "react";

import { cva } from "class-variance-authority";

import { classNames } from "@utils/classNames";

import { CustomVariantProps } from "@/common/common.type";

type ButtonVariantsType = Record<
  "buttonStyle",
  Record<"filled" | "outlined" | "outlined-blue", string>
>;

type ButtonProps = ComponentProps<"button"> &
  CustomVariantProps<ButtonVariantsType>;

const buttonVariants = cva<ButtonVariantsType>(
  "flex justify-center items-center min-w-[120px] min-h-[50px] rounded-[12px] cursor-pointer",
  {
    variants: {
      buttonStyle: {
        filled:
          "bg-button-primary text-white hover:bg-button-hover disabled:bg-button-disabled disabled:text-text-disabled",
        outlined:
          "bg-white text-gray-900 border border-gray-300 hover:bg-gray-50 disabled:text-gray-500",
        "outlined-blue":
          "bg-white text-talearnt-primary border border-talearnt-primary disabled:text-gray-500 disabled:border-gray-300"
      }
    },
    defaultVariants: {
      buttonStyle: "filled"
    }
  }
);

function Button({ className, buttonStyle, children, ...props }: ButtonProps) {
  return (
    <button
      className={classNames(buttonVariants({ buttonStyle, className }))}
      {...props}
    >
      {children}
    </button>
  );
}

export { Button };
