import { useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";

import { useShallow } from "zustand/shallow";

import { classNames } from "@utils/classNames";

import { useAgreementStore } from "@pages/auth/core/auth.store";

import { Stepper } from "@components/Stepper/Stepper";

const stepArray = ["약관 동의", "정보 입력", "가입 완료"];

function SignUp() {
  const navigator = useNavigate();
  const { pathname } = useLocation();

  const { agreements, setAllAgreement } = useAgreementStore(
    useShallow(state => ({
      agreements: state.agreements,
      setAllAgreement: state.setAllAgreement
    }))
  );

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

  useEffect(() => {
    return () => setAllAgreement(false);
  }, [setAllAgreement]);

  useEffect(() => {
    // 필수 약관 동의되어있지 않으면 약관 페이지로 이동 - URL 복붙 방지
    if (agreements.some(({ agree, required }) => !agree && required)) {
      navigator("/sign-up/agreements");
    }
  }, [agreements, navigator]);

  return (
    <div className={classNames("flex flex-col gap-[56px]", "mt-24 w-[632px]")}>
      <Stepper currentStep={returnCurrentStep()} stepArray={stepArray} />
      <Outlet />
    </div>
  );
}

export default SignUp;
