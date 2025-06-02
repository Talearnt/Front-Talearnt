import { ReactNode } from "react";

import { cva, VariantProps } from "class-variance-authority";

import { classNames } from "@shared/utils/classNames";

const labelTextVariants = cva(
  classNames("py-1 px-[8.5px] rounded-lg", "text-body2_16_medium"),
  {
    variants: {
      type: {
        primary: "text-talearnt_Primary_01 bg-talearnt_PrimaryBG_01",
        error: "text-talearnt_Error_01 bg-talearnt_ErrorBG_01",
      },
    },
    defaultVariants: {
      type: "primary",
    },
  }
);

type LabelTextProps = VariantProps<typeof labelTextVariants> & {
  className?: string;
  children?: ReactNode;
};

function LabelText({ className, children, type }: LabelTextProps) {
  return (
    <span className={classNames(labelTextVariants({ type }), className)}>
      {children}
    </span>
  );
}

export { LabelText };
