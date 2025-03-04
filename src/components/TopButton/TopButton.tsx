import { classNames } from "@utils/classNames";

import { useMainScrollRefStore } from "@common/common.store";

function TopButton() {
  const mainScrollRef = useMainScrollRefStore(state => state.mainScrollRef);

  const handleScroll = () => {
    if (!mainScrollRef?.current) {
      return;
    }

    mainScrollRef.current.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <svg
      width="60"
      height="60"
      viewBox="0 0 60 60"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={classNames(
        "fixed bottom-10 right-10",
        "rounded-full fill-talearnt_Icon_03",
        "cursor-pointer",
        "hover:fill-talearnt_Icon_01"
      )}
      onClick={handleScroll}
    >
      <rect width="60" height="60" rx="30" />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M30.6688 16.5518C30.4982 16.3622 30.255 16.2539 29.9999 16.2539C29.7447 16.2539 29.5016 16.3622 29.3309 16.5518L17.7635 29.4045C17.431 29.774 17.461 30.343 17.8304 30.6755C18.1999 31.0081 18.7689 30.9781 19.1014 30.6086L29.0999 19.4993V42.8469C29.0999 43.344 29.5028 43.7469 29.9999 43.7469C30.4969 43.7469 30.8999 43.344 30.8999 42.8469V19.4993L40.8983 30.6086C41.2308 30.9781 41.7999 31.0081 42.1693 30.6755C42.5388 30.343 42.5688 29.774 42.2362 29.4045L30.6688 16.5518Z"
        fill="white"
      />
    </svg>
  );
}

export { TopButton };
