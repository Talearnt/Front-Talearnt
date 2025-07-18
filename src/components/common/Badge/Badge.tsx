import { cva, VariantProps } from "class-variance-authority";

const badgeVariants = cva("rounded-full whitespace-nowrap", {
  variants: {
    type: {
      primary: "bg-talearnt_PrimaryBG_04 text-talearnt_Primary_01",
      disabled: "bg-talearnt_BG_Up_01 text-talearnt_Text_04",
      default: "bg-talearnt_BG_Up_01 text-talearnt_Text_02",
      error: "bg-talearnt_BG_Badge_01 text-talearnt_Text_Red",
      "primary-border":
        "shadow-[inset_0_0_0_1px] shadow-talearnt_PrimaryBG_03 bg-talearnt_PrimaryBG_01 text-talearnt_Primary_01",
      keyword: "rounded-md bg-talearnt_BG_Up_02 text-talearnt_Text_02 ",
    },
    size: {
      small: "px-2 py-1 text-caption2_12_semibold",
      medium: "px-2 py-[6px] text-body3_14_medium",
    },
  },
  defaultVariants: {
    type: "primary",
    size: "small",
  },
});

type BadgeProps = VariantProps<typeof badgeVariants> & {
  className?: string;
  label: string;
};

function Badge({ className, label, type, size }: BadgeProps) {
  return (
    <span className={badgeVariants({ type, size, className })}>{label}</span>
  );
}

export { Badge };
