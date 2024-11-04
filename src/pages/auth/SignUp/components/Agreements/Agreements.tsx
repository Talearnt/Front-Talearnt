import { ChangeEvent } from "react";
import { useFormContext } from "react-hook-form";

import { CheckBox } from "@components/CheckBox/CheckBox";

function Agreements() {
  const { register, setValue } = useFormContext();

  const handleAllCheckboxChange = ({
    target
  }: ChangeEvent<HTMLInputElement>) => {
    const isChecked = target.checked;

    setValue("all", isChecked);
    setValue("agreement1", isChecked);
    setValue("agreement2", isChecked);
    setValue("agreement3", isChecked);
    setValue("agreement4", isChecked);
  };

  return (
    <div className={"flex flex-col"}>
      <CheckBox
        className={"h-[4.375rem] gap-4 border-b border-b-talearnt-Line_01"}
        formData={{ ...register("all") }}
        onChange={handleAllCheckboxChange}
      >
        <p className={"w-full text-lg font-semibold"}>
          전체 동의하기 (선택 정보를 포함합니다.)
        </p>
      </CheckBox>
      <CheckBox
        className={"h-[4.375rem] gap-4 border-b border-b-talearnt-Line_01"}
        formData={{ ...register("agreement1") }}
      >
        <p className={"w-full text-base font-semibold"}>
          <span className={"text-talearnt-Error_01"}>(필수)</span> 이용약관 동의
        </p>
      </CheckBox>
      <CheckBox
        className={"h-[4.375rem] gap-4 border-b border-b-talearnt-Line_01"}
        formData={{ ...register("agreement2") }}
      >
        <p className={"w-full text-base font-semibold"}>
          <span className={"text-talearnt-Error_01"}>(필수)</span> 개인정보 수집
          및 이용 동의
        </p>
      </CheckBox>
      <CheckBox
        className={"h-[4.375rem] gap-4 border-b border-b-talearnt-Line_01"}
        formData={{ ...register("agreement3") }}
      >
        <p className={"w-full text-base font-semibold"}>
          (선택) 마케팅 목적의 개인정보 수집 및 이용 동의
        </p>
      </CheckBox>
      <CheckBox
        className={"h-[4.375rem] gap-4 border-b border-b-talearnt-Line_01"}
        formData={{ ...register("agreement4") }}
      >
        <p className={"w-full text-base font-semibold"}>
          (선택) 광고성 정보 수신 동의
        </p>
      </CheckBox>
    </div>
  );
}

export { Agreements };
