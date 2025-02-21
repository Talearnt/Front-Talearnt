import { cva } from "class-variance-authority";

import { CustomVariantProps } from "@common/common.type";

type BadgeVariantsType = {
  type: Record<
    "primary" | "disabled" | "default" | "error" | "primary-border" | "keyword",
    string
  >;
  size: Record<"small" | "medium", string>;
};

type BadgeProps = CustomVariantProps<BadgeVariantsType> & {
  className?: string;
  label: string;
};

const badgeVariants = cva<BadgeVariantsType>("rounded-full", {
  variants: {
    type: {
      primary: "bg-talearnt_PrimaryBG_04 text-talearnt_Primary_01",
      disabled: "bg-talearnt_BG_Up_01 text-talearnt_Text_04",
      default: "bg-talearnt_BG_Up_01 text-talearnt_Text_02",
      error: "bg-talearnt_BG_Badge_01 text-talearnt_Text_Red",
      "primary-border":
        "shadow-[inset_0_0_0_1px] shadow-talearnt_PrimaryBG_03 bg-talearnt_PrimaryBG_01 text-talearnt_Primary_01",
      keyword:
        "rounded-md bg-talearnt_BG_Up_02 text-talearnt_Text_02 whitespace-nowrap"
    },
    size: {
      small: "px-2 py-1 text-caption2_12_semibold",
      medium: "px-2 py-[6px] text-body3_14_medium"
    }
  },
  defaultVariants: {
    type: "primary",
    size: "small"
  }
});

function Badge({ className, label, type, size }: BadgeProps) {
  return (
    <span className={badgeVariants({ type, size, className })}>{label}</span>
  );
}

export { Badge };
