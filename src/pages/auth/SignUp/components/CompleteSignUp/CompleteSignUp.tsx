import { classNames } from "@utils/classNames";

import { CircleCheckIcon } from "@components/icons/CircleCheckIcon/CircleCheckIcon";

function CompleteSignUp() {
  return (
    <div className={"flex flex-col items-center gap-8"}>
      <CircleCheckIcon className={"stroke-talearnt-Primary_01"} size={70} />
      <p
        className={classNames(
          "flex items-center justify-center",
          "rounded-xl border border-talearnt-Line_01",
          "h-[5.25rem] w-full bg-talearnt-BG_Up_01",
          "font-medium"
        )}
      >
        로그인하시면 더욱 다양한 서비스를 제공 받으실 수 있습니다.
      </p>
    </div>
  );
}

export { CompleteSignUp };
