import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

import { useTimer } from "@/hook/useTimer";
import { yupResolver } from "@hookform/resolvers/yup";
import { object, string } from "yup";

import { classNames } from "@utils/classNames";

import { Button } from "@components/Button/Button";
import { Input } from "@components/Input/Input";

type VerificationCodeProps = {
  confirmCodeHandler: (verificationCode: string) => Promise<void>;
  sendCodeHandler: (phone: string) => Promise<void>;
};

const verificationCodeSchema = object({
  phone: string().matches(/^[0-9]*$/, "올바른 전화번호 형식이 아닙니다."),
  verificationCode: string().matches(
    /^[0-9]*$/,
    "올바른 인증번호 형식이 아닙니다."
  )
}).required();

function VerificationCode({
  confirmCodeHandler,
  sendCodeHandler
}: VerificationCodeProps) {
  const {
    clearErrors,
    formState: { errors },
    register,
    setError,
    watch
  } = useForm({
    mode: "onChange",
    resolver: yupResolver(verificationCodeSchema)
  });

  const { isFinished, isRunning, time, startTimer, stopTimer } = useTimer();

  const [isCodeSent, setIsCodeSent] = useState(false);
  const [verificationAttempts, setVerificationAttempts] = useState(0);

  const [phone, verificationCode] = watch(["phone", "verificationCode"]);
  const hasPhoneNumber = !!phone && phone.length === 11;
  const hasVerificationCode =
    !!verificationCode && verificationCode.length === 4;

  useEffect(() => {
    if (!isFinished) {
      // 타이머 재시작하면 에러 제거
      clearErrors("verificationCode");
    } else {
      // 타이머 초과된 경우 에러 표시
      setError("verificationCode", {
        message:
          "인증번호 입력 시간이 초과되었습니다. 인증번호를 재요청해 주세요"
      });
    }
  }, [clearErrors, isFinished, setError]);

  useEffect(() => {
    // 초기값에는 return
    if (verificationAttempts === 0) {
      return;
    }

    // 10번이상 시도하면 모달
    if (verificationAttempts >= 10) {
      console.log("모달 띄우기");
      return;
    }

    // 5회 연속 실패한 경우
    if (verificationAttempts % 5 === 0) {
      stopTimer();
      setError("verificationCode", {
        message: "5회 연속 인증에  실패하였습니다. 인증번호를 재요청해 주세요."
      });
      return;
    }

    // 실패한 횟수 보여주기
    if (verificationAttempts > 0) {
      setError("verificationCode", {
        message: `인증번호가 일치하지 않습니다(${(verificationAttempts % 5).toString()}/5)`
      });
      return;
    }
  }, [setError, stopTimer, verificationAttempts]);

  return (
    <div className={classNames("flex flex-col gap-6")}>
      {/*휴대폰 본인인증 input*/}
      <Input
        disabled={isRunning}
        error={
          errors.phone && errors.phone.message
            ? {
                errorContent: errors.phone.message,
                hasError: true
              }
            : undefined
        }
        formData={{ ...register("phone") }}
        label={"휴대폰 본인인증"}
        maxLength={11}
        placeholder={"01012345678"}
      >
        {/*인증번호 요청 button */}
        <Button
          buttonStyle={"outlined-blue"}
          className={"ml-2 w-[160px] shrink-0"}
          disabled={!hasPhoneNumber || !!errors.phone || isRunning}
          onClick={async () => {
            if (!phone) {
              return;
            }

            await sendCodeHandler(phone);
            startTimer();
            setIsCodeSent(true);
          }}
        >
          인증번호 {isCodeSent ? "재요청" : "요청"}
        </Button>
      </Input>

      {/*인증번호 확인 input*/}
      <Input
        disabled={!isCodeSent}
        error={
          errors.verificationCode && errors.verificationCode.message
            ? {
                errorContent: errors.verificationCode.message,
                hasError: true
              }
            : undefined
        }
        formData={{ ...register("verificationCode") }}
        label={"인증번호 확인"}
        maxLength={4}
        placeholder={"인증번호 4자리를 입력해 주세요"}
      >
        {/*인증번호 전송 후 3분 타이머*/}
        {isRunning && (
          <p
            className={classNames(
              "absolute right-[119px] top-1/2 -translate-y-1/2",
              "text-base font-medium text-talearnt-Primary_01"
            )}
          >
            {time}
          </p>
        )}
        {/*인증번호 확인 button*/}
        <Button
          buttonStyle={"outlined-blue"}
          className={"ml-2 w-[95px] shrink-0"}
          disabled={
            !isCodeSent || !hasVerificationCode || !!errors.verificationCode
          }
          onClick={async () => {
            if (!verificationCode) {
              return;
            }

            await confirmCodeHandler(verificationCode);
            setVerificationAttempts(prev => prev + 1);
          }}
        >
          확인
        </Button>
      </Input>
    </div>
  );
}

export { VerificationCode };
