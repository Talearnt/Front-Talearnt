import { classNames } from "@utils/classNames";

type TabSliderProps = {
  options: string[];
};

function TabSlider({ options }: TabSliderProps) {
  return (
    <div className={"flex"}>
      {options.map((option, index, array) => (
        <div className={classNames("group flex", index > 0 && "-ml-px")}>
          <input
            className={"peer hidden"}
            id={`option${index.toString()}`}
            name={"slider"}
            type={"radio"}
          />
          <label
            className={classNames(
              "cursor-pointer whitespace-nowrap px-[1.625rem] py-[15px] shadow-[inset_0_0_0_1px] shadow-talearnt-Line_01 peer-checked:relative peer-checked:z-10 peer-checked:shadow-talearnt-Primary_01",
              index === 0 && "rounded-l-xl",
              index === array.length - 1 && "rounded-r-xl"
            )}
            htmlFor={`option${index.toString()}`}
          >
            {option}
          </label>
        </div>
      ))}
    </div>
  );
}

export { TabSlider };
