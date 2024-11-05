import { ChangeEvent } from "react";
import { useFormContext } from "react-hook-form";

import { CheckBox } from "@components/CheckBox/CheckBox";

type agreementsDataType = {
  required: boolean;
  title: string;
}[];

const agreementsData: agreementsDataType = [
  {
    required: true,
    title: "이용약관 동의"
  },
  {
    required: true,
    title: "개인정보 수집"
  },
  {
    required: false,
    title: "마케팅 목적의 개인정보 수집 및 이용 동의"
  },
  {
    required: false,
    title: "광고성 정보 수신 동의"
  }
];

function Agreements() {
  const { register, setValue } = useFormContext();

  const handleAllCheckboxChange = ({
    target
  }: ChangeEvent<HTMLInputElement>) => {
    const isChecked = target.checked;

    setValue("all", isChecked);
    agreementsData.forEach((_, index) =>
      setValue(`agreement${index.toString()}`, isChecked)
    );
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
      {agreementsData.map(({ required, title }, index) => (
        <CheckBox
          className={"h-[4.375rem] gap-4 border-b border-b-talearnt-Line_01"}
          formData={{ ...register(`agreement${index.toString()}`) }}
          key={`agreement${index.toString()}`}
        >
          <p className={"w-full text-base font-semibold"}>
            {required ? (
              <span className={"text-talearnt-Error_01"}>(필수)</span>
            ) : (
              "(선택)"
            )}
            &nbsp;
            {title}
          </p>
        </CheckBox>
      ))}
    </div>
  );
}

export { Agreements };
