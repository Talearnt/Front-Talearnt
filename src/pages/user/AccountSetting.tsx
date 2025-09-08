import { useNavigate } from "react-router-dom";

import { classNames } from "@shared/utils/classNames";

import { useSignOut } from "@features/auth/auth.hook";
import { useGetProfile } from "@features/user/profile/profile.hook";

import { CaretIcon } from "@components/common/icons/caret/CaretIcon";

function AccountSetting() {
  const navigator = useNavigate();

  const {
    data: {
      data: { userId },
    },
  } = useGetProfile();
  const { mutate: signOut } = useSignOut();

  return (
    <div className={"flex flex-col"}>
      <div className={classNames("flex items-center justify-between", "mb-4")}>
        <span
          className={
            "text-heading3_22_semibold leading-[40px] text-talearnt_Text_01"
          }
        >
          로그인한 계정
        </span>
        <button
          className={classNames(
            "h-10 rounded-lg px-3",
            "text-body1_18_medium text-talearnt_Text_03",
            "hover:bg-talearnt_BG_Up_01 hover:text-talearnt_Text_02"
          )}
          onClick={() => signOut()}
        >
          로그아웃
        </button>
      </div>
      <span
        className={classNames(
          "flex items-center",
          "mb-6 h-[72px] rounded-2xl border border-talearnt_Line_01 px-[23px]",
          "text-body1_18_medium text-talearnt_Text_04"
        )}
      >
        {userId}
      </span>
      <button
        className={classNames(
          "flex items-center gap-1",
          "h-10 w-fit rounded-lg px-3",
          "text-body1_18_medium text-talearnt_Text_03",
          "hover:bg-talearnt_BG_Up_01 hover:text-talearnt_Text_02"
        )}
        onClick={() => navigator("/withdrawal")}
      >
        계정탈퇴
        <CaretIcon />
      </button>
    </div>
  );
}

export default AccountSetting;
