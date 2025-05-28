import { cva, VariantProps } from "class-variance-authority";

import { CommonIconProps } from "@components/common/icons/icon.type";

export const caretIconVariants = cva(
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

export type CaretIconProps = CommonIconProps &
  VariantProps<typeof caretIconVariants>;
