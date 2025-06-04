import { ComponentProps } from "react";

import { cva, VariantProps } from "class-variance-authority";

// 공통 아이콘 타입
export type CommonIconProps = ComponentProps<"svg"> & {
  size?: number;
};

// 캐럿 아이콘 타입
export const caretIconVariants = cva(
  "box-content cursor-pointer stroke-talearnt_Icon_03",
  {
    variants: {
      direction: {
        top: "-rotate-90",
        right: "rotate-0",
        bottom: "rotate-90",
        left: "rotate-180",
      },
    },
    defaultVariants: {
      direction: "right",
    },
  }
);

export type CaretIconProps = CommonIconProps &
  VariantProps<typeof caretIconVariants>;

// 스타일드 아이콘 타입
export const styledIconVariants = cva("cursor-pointer", {
  variants: {
    iconType: {
      outlined: "stroke-talearnt_Icon_03",
      "filled-blue": "stroke-talearnt_Primary_01 fill-talearnt_Primary_01",
      "filled-gray": "stroke-talearnt_Icon_04 fill-talearnt_Icon_04",
      "filled-black": "stroke-talearnt_Icon_01 fill-talearnt_Icon_01",
    },
  },
  defaultVariants: {
    iconType: "outlined",
  },
});

export type StyledIconVariantsProps = CommonIconProps &
  VariantProps<typeof styledIconVariants>;
