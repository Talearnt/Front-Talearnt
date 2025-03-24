import { classNames } from "@utils/classNames";

function Dot({ className }: { className?: string }) {
  return (
    <span
      className={classNames(
        "h-1 w-1 rounded-full bg-talearnt_Text_03",
        className
      )}
    />
  );
}

export { Dot };
