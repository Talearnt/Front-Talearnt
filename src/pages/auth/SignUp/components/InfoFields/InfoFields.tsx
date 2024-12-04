import { useState } from "react";

import {
  postConfirmVerificationCode,
  postSendVerificationCode
} from "@pages/auth/api/auth.api";

import { checkObjectType } from "@utils/checkObjectType";

import { Button } from "@components/Button/Button";
import { Input } from "@components/Input/Input";
import { TabSlider } from "@components/TabSlider/TabSlider";
import { VerificationCode } from "@pages/auth/components/VerificationCode/VerificationCode";

const gender = [
  {
    label: "남자",
    value: "male"
  },
  {
    label: "여자",
    value: "female"
  }
];

function InfoFields() {
  const [canProceed, setCanProceed] = useState(false);
  const [isCodeVerified, setIsCodeVerified] = useState(false);

  return (
    <>
      <div className={"flex flex-col gap-6"}>
        {canProceed ? (
          <>
            <Input
              label={"아이디(이메일)"}
              placeholder={"이메일을 입력해 주세요."}
              wrapperClassName={"flex gap-2 items-end"}
            >
              <TabSlider
                currentValue={"male"}
                //eslint-disable-next-line @typescript-eslint/no-empty-function
                onClickHandler={() => {}}
                options={gender}
              />
            </Input>
            <Input
              label={"비밀번호"}
              placeholder={
                "영문, 숫자, 특수문자의 조합 8자리 이상 입력해 주세요"
              }
            />
            <Input
              label={"비밀번호 확인"}
              placeholder={"비밀번호를 한 번 더 입력해 주세요"}
            />
            <Input
              label={"휴대폰 번호"}
              placeholder={"01012345678"}
              wrapperClassName={"flex gap-2 items-end"}
            >
              <Button
                buttonStyle={"outlined"}
                className={"h-[3.125rem] w-[11.25rem] text-talearnt-Text_04"}
              >
                인증번호 요청
              </Button>
            </Input>
            <Input
              label={"인증번호 확인"}
              placeholder={"인증번호 4자리를 입력해 주세요"}
              wrapperClassName={"flex gap-2 items-end"}
            >
              <Button
                buttonStyle={"outlined"}
                className={"h-[3.125rem] w-[5.9375rem] text-talearnt-Text_04"}
              >
                확인
              </Button>
            </Input>
          </>
        ) : (
          <>
            <VerificationCode
              confirmCodeHandler={async ({ phone, verificationCode }) => {
                try {
                  await postConfirmVerificationCode({
                    type: "signUp",
                    phone,
                    code: verificationCode
                  });
                  return true;
                } catch (e) {
                  if (checkObjectType(e) && "errorCode" in e) {
                    return e.errorCode === "400-AUTH-05"
                      ? "400-AUTH-05"
                      : (e.errorMessage as string);
                  }
                  return "예기치 못한 오류가 발생했습니다.";
                }
              }}
              sendCodeHandler={async phone => {
                await postSendVerificationCode({ phone, type: "signUp" });
              }}
              verifiedState={[isCodeVerified, setIsCodeVerified]}
            />
            <Button
              className={"mt-[32px]"}
              disabled={!isCodeVerified}
              onClick={() => setCanProceed(true)}
            >
              다음
            </Button>
          </>
        )}
      </div>
    </>
  );
}

export default InfoFields;
