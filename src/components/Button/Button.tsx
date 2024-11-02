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
  "flex justify-center items-center rounded-lg px-4 py-2 cursor-pointer",
  {
    variants: {
      buttonStyle: {
        filled:
          "bg-talearnt-Primary_01 text-talearnt-BG_Background hover:bg-talearnt-PrimaryBG_02 disabled:bg-talearnt-BG_Up_02 disabled:text-talearnt-Text_04",
        outlined:
          "bg-talearnt-BG_Background text-talearnt-Text_02 border border-talearnt-Icon_02 disabled:text-talearnt-Text_04",
        "outlined-blue":
          "bg-talearnt-BG_Background text-talearnt-Primary_01 border border-talearnt-Primary_01 disabled:text-talearnt-Text_04"
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
