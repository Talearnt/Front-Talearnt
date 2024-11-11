import { useState } from "react";
import { useFormContext } from "react-hook-form";
import { useNavigate } from "react-router-dom";

import { classNames } from "@utils/classNames";

import { Button } from "@components/Button/Button";
import { Stepper } from "@components/Stepper/Stepper";
import { Agreements } from "@pages/auth/SignUp/components/Agreements/Agreements";
import { CompleteSignUp } from "@pages/auth/SignUp/components/CompleteSignUp/CompleteSignUp";
import { SignUpFields } from "@pages/auth/SignUp/components/SignupFields/SignUpFields/SignUpFields";

const stepArray = ["약관 동의", "정보 입력", "가입 완료"];
const stepMessages = [
  <>
    Talearnt 서비스 이용을 위한
    <br />
    약관에 동의해 주세요
  </>,
  <>
    로그인에 사용할
    <br />
    회원정보를 입력해 주세요
  </>,
  <>
    성공적으로 가입되었어요
    <br />
    Talearnt에서 만나요!
  </>
];
const buttonLabels = ["시작 하기", "가입 하기", "로그인"];

function StepFormContainer() {
  const navigator = useNavigate();
  const { watch } = useFormContext();

  const [step, setStep] = useState(1);

  const agreement0 = watch("agreement0");
  const agreement1 = watch("agreement1");

  const handleCTAOnClick = () => {
    if (step < 3) {
      setStep(prev => prev + 1);
    } else {
      navigator("/sign-in");
    }
  };

  return (
    <div className={"flex w-[39.5rem] flex-col"}>
      <Stepper
        className={"mb-[4.125rem]"}
        currentStep={step}
        stepArray={stepArray}
      />
      <p className={"mb-10 text-center text-3xl font-semibold"}>
        {stepMessages[step - 1]}
      </p>
      {step === 1 && <Agreements />}
      {step === 2 && <SignUpFields />}
      {step === 3 && <CompleteSignUp />}
      <div
        className={classNames(
          "mt-[3.5rem] grid grid-rows-[3.125rem] gap-[1.975rem]",
          step === 3 ? "grid-cols-2" : "grid-cols-1"
        )}
      >
        {step === 3 && (
          <Button buttonStyle={"outlined"} onClick={() => navigator("/")}>
            홈으로
          </Button>
        )}
        <Button
          disabled={!agreement0 || !agreement1}
          onClick={handleCTAOnClick}
        >
          {buttonLabels[step - 1]}
        </Button>
      </div>
    </div>
  );
}

export { StepFormContainer };
