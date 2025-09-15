import { Link, useNavigate } from "react-router-dom";

import { classNames } from "@shared/utils/classNames";

import { useSignOut } from "@features/auth/auth.hook";
import {
  useGetAgreements,
  usePatchAdvertisingAgreement,
  usePatchMarketingAgreement,
} from "@features/user/accountSetting/accountSetting.hook";
import { useGetProfile } from "@features/user/profile/profile.hook";

import { CaretIcon } from "@components/common/icons/caret/CaretIcon";
import { Toggle } from "@components/common/Toggle/Toggle";

function AccountSetting() {
  const navigator = useNavigate();

  const {
    data: {
      data: { userId },
    },
  } = useGetProfile();
  const {
    data: {
      data: { marketing, advertising },
    },
  } = useGetAgreements();
  const { mutate: signOut } = useSignOut();
  const { mutate: patchMarketingAgreement } = usePatchMarketingAgreement();
  const { mutate: patchAdvertisingAgreement } = usePatchAdvertisingAgreement();

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <span className="text-heading3_22_semibold leading-[40px] text-talearnt_Text_01">
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
            "h-[72px] rounded-2xl border border-talearnt_Line_01 px-[23px]",
            "text-body1_18_medium text-talearnt_Text_04"
          )}
        >
          {userId}
        </span>
      </div>
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
      <div className="flex flex-col gap-4">
        <span className="text-heading3_22_semibold leading-[40px] text-talearnt_Text_01">
          정보 수신 설정
        </span>
        <div
          className={classNames(
            "flex flex-col gap-6",
            "rounded-[20px] border border-talearnt_Line_01 p-[23px]"
          )}
        >
          <div className="flex items-center justify-between">
            <div className="flex flex-col gap-2">
              <span className="text-heading4_20_semibold text-talearnt_Text_01">
                마케팅 목적의 개인정보 수집 및 이용 동의
              </span>
              <span className="text-body1_18_medium text-talearnt_Text_03">
                이벤트 · 혜택 등 프로모션 소식을 받아보실 수 있어요
              </span>
            </div>
            <div className="flex gap-2">
              <Link
                className={classNames(
                  "py2 px-4",
                  "text-body2_16_medium text-talearnt_Text_02"
                )}
                to={"/agreements/marketing"}
              >
                보기
              </Link>
              <Toggle
                checked={marketing}
                onChange={({ target: { checked } }) =>
                  patchMarketingAgreement(checked)
                }
              />
            </div>
          </div>
          <div className="h-px w-full bg-talearnt_Line_01" />
          <div className="flex items-center justify-between">
            <div className="flex flex-col gap-2">
              <span className="text-heading4_20_semibold text-talearnt_Text_01">
                광고성 정보 수신 동의
              </span>
              <span className="text-body1_18_medium text-talearnt_Text_03">
                앱 알림 · 이메일로 다양한 광고성 정보를 전해드려요
              </span>
            </div>
            <div className="flex gap-2">
              <Link
                className={classNames(
                  "py2 px-4",
                  "text-body2_16_medium text-talearnt_Text_02"
                )}
                to={"/agreements/advertising"}
              >
                보기
              </Link>
              <Toggle
                checked={advertising}
                onChange={({ target: { checked } }) =>
                  patchAdvertisingAgreement(checked)
                }
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AccountSetting;
