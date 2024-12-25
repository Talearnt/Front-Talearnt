import { classNames } from "@utils/classNames";

import { useToastStore } from "@common/common.store";

function Toast() {
  const { toastList } = useToastStore();

  return (
    <div
      className={classNames(
        "fixed bottom-[140px] left-1/2 -translate-x-1/2 transform",
        "flex flex-col items-center gap-4"
      )}
    >
      {toastList.map(({ id, isRemoving, message, type }) => (
        <div
          className={classNames(
            "flex gap-2",
            "w-fit rounded-full border px-10 py-4",
            type === "success" &&
              "bg-talearnt-SuccessBG_01 border-talearnt-Success_01",
            type === "error" &&
              "bg-talearnt-ErrorBG_02 border-talearnt-Error_03",
            isRemoving ? "animate-fade-out" : "animate-fade-in"
          )}
          key={id.toString()}
        >
          {type === "success" && (
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle cx="10" cy="10" r="10" fill="#00CC70" />
              <path
                d="M15.1006 7.3251C15.3945 7.69644 15.3318 8.2355 14.9606 8.5292L9.54706 12.8151C9.23187 13.0646 8.78559 13.0614 8.47382 12.8075L5.31592 10.2362C4.94885 9.93716 4.89362 9.39737 5.19251 9.03018C5.4914 8.66324 6.03131 8.60806 6.39838 8.90689L9.02265 11.0436L13.8965 7.18521C14.2677 6.89127 14.8068 6.95401 15.1006 7.3251Z"
                fill="white"
              />
            </svg>
          )}
          {type === "error" && (
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle cx="10" cy="10" r="10" fill="#FF2727" />
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M11 4.90102C11 4.4034 10.5523 4 10 4C9.44772 4 9 4.4034 9 4.90102V10.157C9 10.6546 9.44772 11.058 10 11.058C10.5523 11.058 11 10.6546 11 10.157V4.90102ZM11 14.0528C11 13.5552 10.5523 13.1518 10 13.1518C9.44772 13.1518 9 13.5552 9 14.0528V14.099C9 14.5966 9.44772 15 10 15C10.5523 15 11 14.5966 11 14.099V14.0528Z"
                fill="white"
              />
            </svg>
          )}
          <span className={"text-talearnt-Text_01 text-base font-semibold"}>
            {message}
          </span>
        </div>
      ))}
    </div>
  );
}

export { Toast };
