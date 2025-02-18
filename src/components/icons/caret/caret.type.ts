import { cva } from "class-variance-authority";

import { CommonIconProps, CustomVariantProps } from "@common/common.type";

type CaretIconVariantsType = Record<
  "direction",
  Record<"top" | "right" | "bottom" | "left", string>
>;

export type CaretIconProps = CommonIconProps &
  CustomVariantProps<CaretIconVariantsType>;

export const caretIconVariants = cva<CaretIconVariantsType>(
  "box-content cursor-pointer stroke-talearnt_Icon_03",
  {
    variants: {
      direction: {
        top: "-rotate-90",
        right: "rotate-0",
        bottom: "rotate-90",
        left: "rotate-180"
      }
    },
    defaultVariants: {
      direction: "right"
    }
  }
);
