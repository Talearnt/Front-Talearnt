import { ComponentProps } from "react";

import { cva } from "class-variance-authority";

import { classNames } from "@utils/classNames";

import { CustomVariantProps } from "@common/common.type";

type ButtonVariantsType = Record<
  "buttonStyle",
  Record<"filled" | "outlined" | "outlined-blue", string>
>;

type ButtonProps = ComponentProps<"button"> &
  CustomVariantProps<ButtonVariantsType>;

const buttonVariants = cva<ButtonVariantsType>(
  classNames(
    "flex items-center justify-center",
    "rounded-lg px-4 py-2",
    "h-[50px] text-[1.125rem] font-medium cursor-pointer",
    "disabled:text-talearnt-Text_04 disabled:cursor-not-allowed"
  ),
  {
    variants: {
      buttonStyle: {
        filled:
          "bg-talearnt-Primary_01 text-talearnt-BG_Background hover:bg-talearnt-PrimaryBG_02 disabled:bg-talearnt-BG_Up_02",
        outlined:
          "bg-talearnt-BG_Background text-talearnt-Text_02 border border-talearnt-Icon_02",
        "outlined-blue":
          "bg-talearnt-BG_Background text-talearnt-Primary_01 border border-talearnt-Primary_01 disabled:border-talearnt-Icon_02 "
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
 * @constructor
 */
function Button({ buttonStyle, children, className, ...props }: ButtonProps) {
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
