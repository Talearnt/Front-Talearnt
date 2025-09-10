import { cva, VariantProps } from "class-variance-authority";

import { classNames } from "@shared/utils/classNames";

const tabSliderVariants = cva(
  classNames(
    "flex items-center justify-center",
    "w-full",
    "cursor-pointer text-talearnt_Text_04 whitespace-nowrap",
    "has-[:checked]:text-talearnt_Primary_01 has-[:disabled]:cursor-not-allowed"
  ),
  {
    variants: {
      type: {
        default: classNames(
          "shadow-[inset_0_0_0_1px] shadow-talearnt_Line_01",
          "text-body2_16_medium",
          "has-[:checked]:z-10 has-[:checked]:shadow-talearnt_Primary_01"
        ),
        shadow: classNames(
          "px-[15px] py-[7px] rounded-xl border border-transparent",
          "text-body1_18_medium",
          "has-[:checked]:bg-talearnt_BG_Background has-[:checked]:border-talearnt_Line_02 has-[:checked]:shadow-shadow_02"
        ),
        "shadow-small": classNames(
          "px-[7px] py-[3px] rounded-lg border border-transparent",
          "text-body3_14_semibold",
          "has-[:checked]:bg-talearnt_BG_Background has-[:checked]:border-talearnt_Line_02 has-[:checked]:shadow-shadow_02"
        ),
      },
    },
    defaultVariants: {
      type: "default",
    },
  }
);

type TabSliderProps<T> = VariantProps<typeof tabSliderVariants> & {
  className?: string;
  currentValue: T;
  disabled?: boolean;
  onClickHandler?: (value: T) => void;
  options: { label: string; value: T }[];
};

const defaultStyle = ({
  disabled,
  index,
  maxLength,
}: {
  disabled?: boolean;
  index: number;
  maxLength: number;
}) =>
  classNames(
    disabled &&
      "!text-talearnt_Text_04 has-[:checked]:bg-talearnt_BG_Up_01 has-[:checked]:shadow-talearnt_Line_01",
    index === 0 ? "rounded-l-lg" : "-ml-px",
    index === maxLength && "rounded-r-lg"
  );

function TabSlider<T = string>({
  className,
  currentValue,
  disabled,
  onClickHandler,
  options,
  type = "default",
}: TabSliderProps<T>) {
  return (
    <div
      className={classNames(
        "flex",
        type?.startsWith("shadow") &&
          "border border-talearnt_Line_02 bg-talearnt_BG_Up_01",
        type === "shadow" && "gap-4 rounded-xl p-[7px]",
        type === "shadow-small" && "gap-1 rounded-lg p-[3px]",
        className
      )}
    >
      {options.map(({ label, value }, index, array) => (
        <label
          className={classNames(
            tabSliderVariants({ type }),
            type === "default" &&
              defaultStyle({ disabled, index, maxLength: array.length - 1 })
          )}
          key={`${String(value)}-${index}`}
        >
          <input
            checked={currentValue === value}
            className={"hidden"}
            disabled={disabled}
            onClick={() => onClickHandler?.(value)}
            readOnly
            type={"radio"}
          />
          {label}
        </label>
      ))}
    </div>
  );
}

export { TabSlider };
