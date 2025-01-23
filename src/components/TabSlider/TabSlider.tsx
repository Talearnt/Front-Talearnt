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
    "cursor-pointer text-base font-medium",
    "has-[:checked]:text-talearnt-Primary_01",
    "has-[:disabled]:cursor-not-allowed"
  ),
  {
    variants: {
      type: {
        default: classNames(
          "shadow-[inset_0_0_0_1px] shadow-talearnt-Line_01",
          "has-[:checked]:z-10 has-[:checked]:shadow-talearnt-Primary_01"
        ),
        shadow: classNames(
          "px-[15px] py-[7px] rounded-full",
          "border border-transparent",
          "text-lg text-talearnt-Text_04",
          "has-[:checked]:text-talearnt-Primary_01 has-[:checked]:bg-talearnt-BG_Background has-[:checked]:border-talearnt-Line_02 has-[:checked]:shadow-[0_0_20px_0_rgba(0,0,0,0.08)]"
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
      "!text-talearnt-Text_04 has-[:checked]:bg-talearnt-BG_Up_01 has-[:checked]:shadow-talearnt-Line_01",
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
          "border-talearnt-Line_02 gap-4 rounded-full border bg-talearnt-BG_Up_01 p-[7px]",
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
          key={`${value}-${index.toString()}`}
        >
          <input
            checked={currentValue === value}
            className={"hidden"}
            disabled={disabled}
            onClick={() => onClickHandler?.(value)}
            type={"radio"}
          />
          {label}
        </label>
      ))}
    </div>
  );
}

export { TabSlider };
