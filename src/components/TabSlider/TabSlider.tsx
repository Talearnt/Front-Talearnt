import { classNames } from "@utils/classNames";

type TabSliderProps = {
  className?: string;
  currentValue: string;
  onChangeHandler: (value: string) => void;
  options: { label: string; value: string }[];
};

function TabSlider({
  className,
  currentValue,
  onChangeHandler,
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
            id={`option${index.toString()}`}
            name={"slider"}
            onChange={() => onChangeHandler(value)}
            type={"radio"}
          />
          <label
            className={classNames(
              "flex items-center justify-center",
              "shadow-[inset_0_0_0_1px] shadow-talearnt-Line_01",
              "w-full cursor-pointer whitespace-nowrap text-center",
              "peer-checked:relative peer-checked:z-10 peer-checked:shadow-talearnt-Primary_01",
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
