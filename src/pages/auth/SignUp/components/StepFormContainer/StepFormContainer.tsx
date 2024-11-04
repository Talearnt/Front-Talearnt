import { useState } from "react";
import { useFormContext } from "react-hook-form";

import { Button } from "@components/Button/Button";
import { Stepper } from "@components/Stepper/Stepper";
import { Agreements } from "@pages/auth/SignUp/components/Agreements/Agreements";

const stepArray = ["약관 동의", "정보 입력", "가입 완료"];

function StepFormContainer() {
  const { getValues } = useFormContext();

  const [step, setStep] = useState(1);

  const handleCTAOnClick = () => setStep(prev => prev + 1);

  return (
    <div className={"mx-auto mt-[6.5rem] flex w-[39.5rem] flex-col"}>
      <Stepper
        className={"mb-[4.125rem]"}
        currentStep={step}
        stepArray={stepArray}
      />
      <p className={"mb-10 text-center text-3xl font-semibold"}>
        Talearnt 서비스 이용을 위한
        <br />
        약관에 동의해 주세요
      </p>
      {step === 1 && <Agreements />}
      <Button onClick={handleCTAOnClick}>
        {step === 1 && "시작 하기"}
        {step === 2 && "가입 하기"}
      </Button>
    </div>
  );
}

export { StepFormContainer };
