import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { classNames } from "@shared/utils/classNames";

import { useGetProfile } from "@features/user/profile/profile.hook";
import { useWithdrawAccount } from "@features/user/withdrawAccount/withdrawAccount.hook";

import { usePromptStore } from "@store/prompt.store";

import { Button } from "@components/common/Button/Button";
import { Checkbox } from "@components/common/Checkbox/Checkbox";
import { Dot } from "@components/common/Dot/Dot";
import { Textarea } from "@components/common/Textarea/Textarea";

import {
  deletedItemsList,
  withdrawalCautionList,
  withdrawalReasonsList,
} from "@features/user/withdrawAccount/withdrawAccount.constants";

import { withdrawalBodyType } from "@features/user/withdrawAccount/withdrawAccount.type";

function WithdrawAccount() {
  const navigator = useNavigate();

  const [{ withdrawalReasons, detailedReason, isAgreed }, setWithdrawal] =
    useState<withdrawalBodyType & { isAgreed: boolean }>({
      withdrawalReasons: [],
      detailedReason: "",
      isAgreed: false,
    });

  const setPrompt = usePromptStore(state => state.setPrompt);

  const {
    data: {
      data: { nickname },
    },
  } = useGetProfile();
  const { mutate: withdrawAccount } = useWithdrawAccount();

  return (
    <div
      className={classNames(
        "flex flex-col justify-center",
        "w-[632px] pt-[96px]"
      )}
    >
      <p
        className={classNames(
          "mb-2",
          "text-center text-heading1_30_semibold text-talearnt_Text_Strong"
        )}
      >
        {nickname}님, 탈퇴시
        <br />
        함께한 활동과 정보가 모두 사라져요 😢
      </p>
      <p
        className={classNames(
          "mb-14",
          "text-center text-body1_18_medium text-talearnt_Text_03"
        )}
      >
        이유를 알려주실 수 있나요? 서비스 개선에 큰 도움이 돼요
      </p>
      <div className="mb-6 h-[1px] w-full bg-talearnt_Line_01" />
      <span className="text-heading3_22_semibold text-talearnt_Text_Strong">
        탈퇴 사유 (선택)
      </span>
      <div className={classNames("grid grid-cols-2", "my-6")}>
        {withdrawalReasonsList.map(reason => (
          <Checkbox
            className={classNames(
              "gap-4",
              "h-[72px] border-b border-b-talearnt_Line_01 px-4"
            )}
            checked={withdrawalReasons.includes(reason)}
            onChange={({ target }) =>
              setWithdrawal(prev => ({
                ...prev,
                withdrawalReasons: target.checked
                  ? [...prev.withdrawalReasons, reason]
                  : prev.withdrawalReasons.filter(r => r !== reason),
              }))
            }
            key={reason}
          >
            <span className={"w-full text-body2_16_semibold"}>{reason}</span>
          </Checkbox>
        ))}
      </div>
      <Textarea
        className="mb-14"
        placeholder="상세한 이유를 말씀해 주실 수 있나요?"
        maxLength={500}
        rows={5}
        value={detailedReason}
        onChange={({ target }) =>
          setWithdrawal(prev => ({ ...prev, detailedReason: target.value }))
        }
      />
      <div className="mb-6 h-[1px] w-full bg-talearnt_Line_01" />
      <span className="text-heading3_22_semibold text-talearnt_Text_Strong">
        삭제되는 항목
      </span>
      <ul className={"mb-14 mt-6 space-y-4"}>
        {deletedItemsList.map(item => (
          <li className={"flex items-center gap-2"} key={item}>
            <Dot className={"h-[6px] w-[6px] bg-talearnt_Text_02"} />
            <p className="text-body1_18_medium text-talearnt_Text_02">{item}</p>
          </li>
        ))}
      </ul>
      <div
        className={classNames(
          "flex flex-col gap-6",
          "mb-6 rounded-2xl bg-talearnt_BG_Up_01 p-5"
        )}
      >
        <span className="text-body2_16_medium text-talearnt_Text_Strong">
          유의사항
        </span>
        <ul className={"space-y-4"}>
          {withdrawalCautionList.map(caution => (
            <li className={"flex items-center gap-2"} key={caution}>
              <Dot className={"h-[6px] w-[6px] bg-talearnt_Text_03"} />
              <p className="text-body2_16_medium text-talearnt_Text_03">
                {caution}
              </p>
            </li>
          ))}
        </ul>
      </div>
      <Checkbox
        className={classNames("gap-4", "mb-14")}
        checked={isAgreed}
        onChange={({ target }) =>
          setWithdrawal(prev => ({ ...prev, isAgreed: target.checked }))
        }
      >
        <span className={"w-full text-body2_16_semibold"}>
          위 내용을 확인하셨나요? 그래도 탤런트를 떠나실건가요?
        </span>
      </Checkbox>
      <div className={"flex gap-4"}>
        <Button
          buttonStyle="outlined"
          className="w-full"
          onClick={() => navigator("/user/account")}
        >
          그만두기
        </Button>
        <Button
          className="w-full"
          disabled={!isAgreed}
          onClick={() =>
            setPrompt({
              title: "계정 탈퇴",
              content:
                "이 버튼을 누르면 탤런트와 이별하게 돼요\n정말로 탈퇴하시겠어요...?",
              confirmOnClickHandler: () =>
                withdrawAccount({
                  withdrawalReasons,
                  detailedReason,
                }),
              cancelText: "그만두기",
              confirmText: "탈퇴하기",
            })
          }
        >
          탈퇴하기
        </Button>
      </div>
    </div>
  );
}

export default WithdrawAccount;
