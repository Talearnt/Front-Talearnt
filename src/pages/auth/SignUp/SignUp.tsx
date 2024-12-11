import { Outlet, useLocation } from "react-router-dom";

import { classNames } from "@utils/classNames";

import { Stepper } from "@components/Stepper/Stepper";

const stepArray = ["약관 동의", "정보 입력", "가입 완료"];

function SignUp() {
  const { pathname } = useLocation();

  const pathArray = pathname.split("/");
  const currentPage = pathArray[pathArray.length - 1];

  const returnCurrentStep = (): number => {
    switch (currentPage) {
      case "complete":
        return 3;
      case "info-fields":
        return 2;
      case "agreement":
      default:
        return 1;
    }
  };

  return (
    <div className={classNames("flex flex-col gap-[56px]", "w-[632px]")}>
      <Stepper currentStep={returnCurrentStep()} stepArray={stepArray} />
      <Outlet />
    </div>
  );
}

export default SignUp;
