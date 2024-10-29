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

/**
 * Button 컴포넌트
 * filled - 포인트 배경 / 흰색 글자
 * outlined - 흰색 배경 / 검정 글자 / 회색 테두리
 * outlined-blue - 흰색 배경 / 포인트 글자 / 포인트 테두리
 *
 * @param {string | undefined} className
 * @param {"filled" | "outlined" | "outlined-blue"} buttonStyle
 * @param {React.ReactElement<any, string | React.JSXElementConstructor<any>> | string | number | Iterable<React.ReactNode> | React.ReactPortal | boolean | undefined | null} children
 * @param {Omit<ButtonProps, "className" | "children" | "buttonStyle">} props
 * @returns {JSX.Element}
 * @constructor
 */
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
