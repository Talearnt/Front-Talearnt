import { cva, VariantProps } from "class-variance-authority";

const badgeVariants = cva("whitespace-nowrap", {
  variants: {
    color: {
      skyblue: "bg-talearnt_PrimaryBG_04 text-talearnt_Primary_01",
      blue: "bg-talearnt_PrimaryBG_01 text-talearnt_Primary_01",
      lightgray: "bg-talearnt_BG_Up_01 text-talearnt_Text_04",
      gray: "bg-talearnt_BG_Up_01 text-talearnt_Text_02",
      darkgray: "bg-talearnt_BG_Up_02 text-talearnt_Text_02",
      red: "bg-talearnt_BG_Badge_01 text-talearnt_Text_Red",
    },
    size: {
      small: "px-2 py-1 text-caption2_12_semibold",
      medium: "px-2 py-[6px] text-body3_14_medium",
    },
    rounded: {
      full: "rounded-full",
      md: "rounded-md",
    },
  },
  defaultVariants: {
    color: "skyblue",
    size: "small",
    rounded: "full",
  },
});

type BadgeProps = VariantProps<typeof badgeVariants> & {
  className?: string;
  label: string;
};

function Badge({ className, label, ...props }: BadgeProps) {
  return (
    <span className={badgeVariants({ className, ...props })}>{label}</span>
  );
}

export { Badge };
