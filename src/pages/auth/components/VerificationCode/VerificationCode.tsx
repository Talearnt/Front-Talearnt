import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useForm } from "react-hook-form";

import { yupResolver } from "@hookform/resolvers/yup";
import dayjs from "dayjs";
import { object, string } from "yup";

import { checkObjectType } from "@utils/checkObjectType";
import { classNames } from "@utils/classNames";

import { useTimer } from "@hook/useTimer";

import { usePromptStore } from "@common/common.store";

import { Button } from "@components/Button/Button";
import { Input } from "@components/Input/Input";
import { Spinner } from "@components/Spinner/Spinner";

import { verificationStateType } from "@pages/auth/auth.type";

type sendCodeDataType = {
  sendTime: Date | undefined;
  sendCount: number;
};

type VerificationCodeProps = {
  confirmCodeHandler: ({
    phone,
    verificationCode
  }: {
    phone: string;
    verificationCode: string;
  }) => Promise<string | true>;
  isSendButtonDisabled?: boolean;
  sendCodeHandler: (phone: string) => Promise<void>;
  verificationState: [
    verificationStateType,
    Dispatch<SetStateAction<verificationStateType>>
  ];
};

const verificationCodeSchema = object({
  phone: string().matches(
    /^[0-9]*$/,
    "올바른 전화번호 형식이 아닙니다. 숫자만 입력해 주세요."
  ),
  verificationCode: string().matches(
    /^[0-9]*$/,
    "올바른 인증번호 형식이 아닙니다. 숫자만 입력해 주세요."
  )
}).required();

const isDateOver10MinutesOld = (date?: Date) =>
  dayjs().diff(dayjs(date), "minute") >= 10;

function VerificationCode({
  confirmCodeHandler,
  isSendButtonDisabled,
  sendCodeHandler,
  verificationState
}: VerificationCodeProps) {
  const {
    clearErrors,
    formState: { errors },
    register,
    setError,
    setFocus,
    setValue,
    watch
  } = useForm({
    mode: "onChange",
    resolver: yupResolver(verificationCodeSchema)
  });

  const { isFinished, isRunning, time, startTimer, stopTimer } = useTimer();
  const { setPrompt } = usePromptStore();

  const [{ isCodeVerified }, setVerification] = verificationState;
  const [isLoading, setIsLoading] = useState<
    undefined | "phone" | "verificationCode"
  >();
  const [verificationAttempts, setVerificationAttempts] = useState(0);
  const [{ sendCount, sendTime }, setSendCodeData] = useState<sendCodeDataType>(
    () => {
      const data = localStorage.getItem("verification-data");

      if (data === null) {
        return {
          sendCount: 0,
          sendTime: undefined
        };
      }

      const { sendCount, sendTime } = JSON.parse(data) as sendCodeDataType;

      if (isDateOver10MinutesOld(sendTime)) {
        return {
          sendCount: 0,
          sendTime: undefined
        };
      }

      return {
        sendCount,
        sendTime
      };
    }
  );

  const [phone, verificationCode] = watch(["phone", "verificationCode"]);
  const hasPhoneNumber = !!phone && phone.length === 11;
  const hasVerificationCode =
    !!verificationCode && verificationCode.length === 4;

  const saveSendCodeData = (data: sendCodeDataType) => {
    localStorage.setItem("verification-data", JSON.stringify(data));

    setSendCodeData(data);
  };

  const handleSendCode = async () => {
    if (!phone) {
      return;
    }

    if (sendCount === 5 && !isDateOver10MinutesOld(sendTime)) {
      setPrompt({
        title: "1분 내에  인증번호 5회 초과",
        content:
          "1분 내에 5회 연속 인증에 실패하였습니다. 10분 후 다시 시도해 주세요."
      });

      saveSendCodeData({
        sendCount: sendCount + 1,
        sendTime: new Date()
      });
      return;
    }

    try {
      setIsLoading("phone");
      if (sendTime === undefined || isDateOver10MinutesOld(sendTime)) {
        saveSendCodeData({
          sendCount: 1,
          sendTime: new Date()
        });
      } else {
        saveSendCodeData({ sendCount: sendCount + 1, sendTime });
      }
      await sendCodeHandler(phone);
      clearErrors("phone");
      clearErrors("verificationCode");
      startTimer();
    } catch (e) {
      if (checkObjectType(e) && "errorMessage" in e) {
        setError("phone", {
          message: e.errorMessage as string
        });
        return;
      }

      setPrompt({
        title: "서버 오류",
        content:
          "알 수 없는 이유로 인증번호 요청에 실패하였습니다.\n다시 시도해 주세요."
      });
    } finally {
      setIsLoading(undefined);
    }
  };

  const handleVerifyCode = async () => {
    if (!verificationCode || !phone) {
      return;
    }

    setIsLoading("verificationCode");
    const data = await confirmCodeHandler({ phone, verificationCode });

    if (data === true) {
      // 인증번호 확인 완료
      setVerification({ isCodeVerified: true, phone });
      setIsLoading(undefined);
      return;
    }

    setFocus("verificationCode");

    if (data === "400-AUTH-05") {
      // 인증번호가 틀린 경우
      setVerificationAttempts(prev => prev + 1);
      setIsLoading(undefined);
      return;
    }

    // 그 외 다양한 경우
    setError("verificationCode", {
      message: data
    });
    setIsLoading(undefined);
  };

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

    if (verificationAttempts % 5 === 0) {
      // 5회 연속 실패한 경우
      stopTimer();
      setError("verificationCode", {
        message: "5회 연속 인증에  실패하였습니다. 인증번호를 재요청해 주세요."
      });
      setValue("verificationCode", "");
      return;
    }

    if (verificationAttempts > 0) {
      // 실패한 횟수 보여주기
      setError("verificationCode", {
        message: `인증번호가 일치하지 않습니다(${(verificationAttempts % 5).toString()}/5)`
      });
      return;
    }
  }, [setError, setValue, stopTimer, verificationAttempts]);

  useEffect(() => {
    if (sendTime === undefined || sendCount <= 5) {
      return;
    }

    const ping = setInterval(() => {
      if (isDateOver10MinutesOld(sendTime)) {
        saveSendCodeData({ sendCount: 0, sendTime: undefined });

        clearInterval(ping);
      }
    }, 1000);

    return () => clearInterval(ping);
  }, [sendCount, sendTime]);

  return (
    <div className={classNames("flex flex-col gap-6")}>
      {/*휴대폰 본인인증 input*/}
      <Input
        disabled={isRunning || isCodeVerified || sendCount > 5}
        error={errors.phone?.message}
        formData={{ ...register("phone") }}
        label={"휴대폰 본인인증"}
        maxLength={11}
        placeholder={"01012345678"}
      >
        {/*인증번호 요청 button */}
        <Button
          buttonStyle={"outlined-blue"}
          className={"ml-2 w-[160px] shrink-0"}
          disabled={
            !hasPhoneNumber ||
            !!errors.phone ||
            isRunning ||
            isCodeVerified ||
            isSendButtonDisabled ||
            sendCount > 5
          }
          onClick={handleSendCode}
        >
          {isLoading === "phone" ? (
            <Spinner />
          ) : (
            `인증번호 ${isRunning || verificationAttempts > 0 ? "재요청" : "요청"}`
          )}
        </Button>
      </Input>

      {/*인증번호 확인 input*/}
      <Input
        complete={isCodeVerified ? "인증이 완료되었습니다" : undefined}
        disabled={!isRunning || isCodeVerified}
        error={
          sendCount > 5
            ? "10분 후 다시 시도해 주세요."
            : errors.verificationCode?.message
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
            !isRunning ||
            !hasVerificationCode ||
            !!errors.verificationCode ||
            isCodeVerified
          }
          onClick={handleVerifyCode}
        >
          {isLoading === "verificationCode" ? <Spinner /> : "확인"}
        </Button>
      </Input>
    </div>
  );
}

export { VerificationCode };
