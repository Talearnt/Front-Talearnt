import { ReactNode } from "react";

import { cva } from "class-variance-authority";

import { classNames } from "@utils/classNames";

import { CustomVariantProps } from "@common/common.type";

type LabelTextVariantsType = Record<
  "type",
  Record<"primary" | "error", string>
>;

type LabelTextProps = CustomVariantProps<LabelTextVariantsType> & {
  className?: string;
  children?: ReactNode;
};

const labelTextVariants = cva<LabelTextVariantsType>(
  classNames("py-1 px-[8.5px] rounded-lg", "text-base font-medium"),
  {
    variants: {
      type: {
        primary: "text-talearnt-Primary_01 bg-talearnt-PrimaryBG_01",
        error: "text-talearnt-Error_01 bg-talearnt-ErrorBG_01"
      }
    },
    defaultVariants: {
      type: "primary"
    }
  }
);

function LabelText({ className, children, type }: LabelTextProps) {
  return (
    <span className={classNames(labelTextVariants({ type, className }))}>
      {children}
    </span>
  );
}

export { LabelText };
