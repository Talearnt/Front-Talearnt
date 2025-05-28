import { ComponentProps } from "react";

import { cva, VariantProps } from "class-variance-authority";

import { classNames } from "@shared/utils/classNames";

const buttonVariants = cva(
  classNames(
    "flex items-center justify-center",
    "rounded-lg px-4 py-2",
    "cursor-pointer",
    "disabled:text-talearnt_Text_04 disabled:cursor-not-allowed"
  ),
  {
    variants: {
      buttonStyle: {
        filled:
          "bg-talearnt_Primary_01 text-talearnt_BG_Background hover:bg-talearnt_PrimaryBG_02 disabled:bg-talearnt_BG_Up_02",
        outlined:
          "bg-talearnt_BG_Background text-talearnt_Text_02 border border-talearnt_Icon_03",
        "outlined-blue":
          "bg-talearnt_BG_Background text-talearnt_Primary_01 border border-talearnt_Primary_01 disabled:border-talearnt_Icon_02 "
      },
      size: {
        small: "min-w-20 h-[40px] text-body2_16_medium",
        large: "min-w-[101px] h-[50px] text-body1_18_medium"
      }
    },
    defaultVariants: {
      buttonStyle: "filled",
      size: "large"
    }
  }
);

type ButtonProps = ComponentProps<"button"> &
  VariantProps<typeof buttonVariants>;

/**
 * Button 컴포넌트
 * filled - 포인트 배경 / 흰색 글자
 * outlined - 흰색 배경 / 검정 글자 / 회색 테두리
 * outlined-blue - 흰색 배경 / 포인트 글자 / 포인트 테두리
 *
 * @param {string | undefined} className
 * @param {"filled" | "outlined" | "outlined-blue"} buttonStyle
 * @param {React.ReactElement<any, string | React.JSXElementConstructor<any>> | string | number | Iterable<React.ReactNode> | React.ReactPortal | boolean | undefined | null} children
 * @param {"small" | "large"} size
 * @param {Omit<ButtonProps, "className" | "children" | "buttonStyle">} props
 * @constructor
 */
function Button({
  buttonStyle,
  children,
  className,
  size,
  ...props
}: ButtonProps) {
  return (
    <button
      className={classNames(buttonVariants({ buttonStyle, size }), className)}
      {...props}
    >
      {children}
    </button>
  );
}

export { Button };
