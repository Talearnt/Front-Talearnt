import { classNames } from "@utils/classNames";

type TabSliderProps = {
  className?: string;
  currentValue: string;
  disabled?: boolean;
  onChangeHandler?: (value: string) => void;
  onClickHandler?: (value: string) => void;
  options: { label: string; value: string }[];
};

function TabSlider({
  className,
  currentValue,
  disabled,
  onChangeHandler,
  onClickHandler,
  options
}: TabSliderProps) {
  return (
    <div className={classNames("flex", className)}>
      {options.map(({ label, value }, index, array) => (
        <div
          className={classNames(
            "group flex",
            "h-[50px] w-full",
            index > 0 && "-ml-px"
          )}
          key={`${value}-${index.toString()}`}
        >
          <input
            checked={currentValue === value}
            className={"peer hidden"}
            disabled={disabled}
            id={`option${index.toString()}`}
            name={"slider"}
            onChange={() => onChangeHandler && onChangeHandler(value)}
            onClick={() => onClickHandler && onClickHandler(value)}
            type={"radio"}
          />
          <label
            className={classNames(
              "flex items-center justify-center",
              "shadow-[inset_0_0_0_1px] shadow-talearnt-Line_01",
              "w-full",
              "cursor-pointer whitespace-nowrap text-base font-medium",
              "peer-checked:relative peer-checked:z-10 peer-checked:text-talearnt-Primary_01 peer-checked:shadow-talearnt-Primary_01",
              "peer-disabled:cursor-not-allowed peer-disabled:text-talearnt-Text_04 peer-disabled:peer-checked:bg-talearnt-BG_Up_01 peer-disabled:peer-checked:shadow-talearnt-Line_01",
              index === 0 && "rounded-l-xl",
              index === array.length - 1 && "rounded-r-xl"
            )}
            htmlFor={`option${index.toString()}`}
          >
            {label}
          </label>
        </div>
      ))}
    </div>
  );
}

export { TabSlider };
