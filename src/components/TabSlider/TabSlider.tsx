import { cva } from "class-variance-authority";

import { classNames } from "@utils/classNames";

import { CustomVariantProps } from "@common/common.type";

type TabSliderVariantsType = Record<
  "type",
  Record<"default" | "shadow", string>
>;

type TabSliderProps = CustomVariantProps<TabSliderVariantsType> & {
  className?: string;
  currentValue: string;
  disabled?: boolean;
  onClickHandler?: (value: string) => void;
  options: { label: string; value: string }[];
};

const tabSliderVariants = cva<TabSliderVariantsType>(
  classNames(
    "flex items-center justify-center",
    "w-full",
    "cursor-pointer text-body2_16_medium whitespace-nowrap",
    "has-[:checked]:text-talearnt_Primary_01",
    "has-[:disabled]:cursor-not-allowed"
  ),
  {
    variants: {
      type: {
        default: classNames(
          "shadow-[inset_0_0_0_1px] shadow-talearnt_Line_01",
          "has-[:checked]:z-10 has-[:checked]:shadow-talearnt_Primary_01"
        ),
        shadow: classNames(
          "px-[15px] py-[7px] rounded-full border border-transparent",
          "text-body1_18_medium text-talearnt_Text_04",
          "has-[:checked]:text-talearnt_Primary_01 has-[:checked]:bg-talearnt_BG_Background has-[:checked]:border-talearnt_Line_02 has-[:checked]:shadow-shadow_02"
        )
      }
    },
    defaultVariants: {
      type: "default"
    }
  }
);

const defaultStyle = ({
  disabled,
  index,
  maxLength
}: {
  disabled?: boolean;
  index: number;
  maxLength: number;
}) =>
  classNames(
    disabled &&
      "!text-talearnt_Text_04 has-[:checked]:bg-talearnt_BG_Up_01 has-[:checked]:shadow-talearnt_Line_01",
    index === 0 ? "rounded-l-xl" : "-ml-px",
    index === maxLength && "rounded-r-xl"
  );

function TabSlider({
  className,
  currentValue,
  disabled,
  onClickHandler,
  options,
  type
}: TabSliderProps) {
  return (
    <div
      className={classNames(
        "flex",
        type === "shadow" &&
          "gap-4 rounded-full border border-talearnt_Line_02 bg-talearnt_BG_Up_01 p-[7px]",
        className
      )}
    >
      {options.map(({ label, value }, index, array) => (
        <label
          className={classNames(
            tabSliderVariants({ type }),
            type !== "shadow" &&
              defaultStyle({ disabled, index, maxLength: array.length - 1 })
          )}
          key={`${value}-${index}`}
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
