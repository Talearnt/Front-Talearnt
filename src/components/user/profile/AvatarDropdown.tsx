import { useRef } from "react";
import { NavLink } from "react-router-dom";

import { classNames } from "@shared/utils/classNames";

import { useOutsideClick } from "@components/common/dropdowns/dropdown.hook";

import { Avatar } from "@components/shared/Avatar/Avatar";

import { profileType } from "@features/user/profile/profile.type";

function AvatarDropdown({ profileImg }: Pick<profileType, "profileImg">) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const checkboxRef = useRef<HTMLInputElement>(null);

  useOutsideClick(wrapperRef, checkboxRef);

  return (
    <div ref={wrapperRef} className={"relative w-fit"}>
      <label
        className={classNames(
          "peer/label",
          "flex items-center",
          "cursor-pointer"
        )}
      >
        <input
          ref={checkboxRef}
          className={"peer/checkbox hidden"}
          type={"checkbox"}
        />
        <Avatar imageUrl={profileImg} size={32} />
        <svg
          className={"peer-checked/checkbox:-rotate-180"}
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M4.60482 5.69531H11.3952C11.5153 5.69582 11.6326 5.73193 11.7322 5.79908C11.8318 5.86623 11.9092 5.96141 11.9547 6.07258C12.0002 6.18374 12.0118 6.30591 11.9878 6.42362C11.9639 6.54134 11.9056 6.64932 11.8203 6.73391L8.43123 10.123C8.37477 10.1799 8.30759 10.2251 8.23358 10.256C8.15957 10.2868 8.08018 10.3027 8 10.3027C7.91982 10.3027 7.84043 10.2868 7.76642 10.256C7.69241 10.2251 7.62523 10.1799 7.56877 10.123L4.17966 6.73391C4.09438 6.64932 4.03609 6.54134 4.01217 6.42362C3.98824 6.30591 3.99977 6.18374 4.04527 6.07258C4.09078 5.96141 4.16823 5.86623 4.26783 5.79908C4.36743 5.73193 4.4847 5.69582 4.60482 5.69531Z"
            fill="#414A4E"
          />
        </svg>
      </label>
      <div
        className={classNames(
          "absolute hidden -translate-x-1/2",
          "flex-col gap-2",
          "z-[11] mt-1 w-[150px] rounded-lg bg-talearnt_BG_Background p-2 shadow-shadow_02",
          "peer-has-[:checked]/label:flex"
        )}
      >
        {[
          { label: "마이페이지", value: "/user" },
          { label: "찜 목록", value: "/user/likes" },
          { label: "로그아웃", value: "/logout" },
        ].map(({ label, value }) => (
          <NavLink
            className={classNames(
              "rounded-lg bg-talearnt_BG_Background p-2",
              "text-body3_14_medium text-talearnt_Text_02",
              "hover:bg-talearnt_BG_Up_01"
            )}
            onClick={() => {
              if (!checkboxRef.current) {
                return;
              }

              checkboxRef.current.checked = false;
            }}
            to={value}
            key={value}
          >
            {label}
          </NavLink>
        ))}
      </div>
    </div>
  );
}

export { AvatarDropdown };
