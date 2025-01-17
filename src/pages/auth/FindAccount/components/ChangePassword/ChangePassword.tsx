import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useSearchParams } from "react-router-dom";

import { yupResolver } from "@hookform/resolvers/yup";
import { object, ref as yupRef, string } from "yup";

import { putChangePw } from "@pages/auth/auth.api";

import { checkObjectType } from "@utils/checkObjectType";
import { classNames } from "@utils/classNames";

import { Button } from "@components/Button/Button";
import { CircleCheckIcon } from "@components/icons/CircleCheckIcon/CircleCheckIcon";
import { Input } from "@components/inputs/Input/Input";
import { LabelText } from "@components/LabelText/LabelText";
import { Spinner } from "@components/Spinner/Spinner";

import { pwRegex } from "@pages/auth/common/common.constants";

const changePasswordSchema = object({
  pw: string().matches(
    pwRegex,
    "영문, 숫자, 특수 문자를 포함한 8자 이상의 비밀번호를 입력해 주세요."
  ),
  checkedPw: string().oneOf([yupRef("pw"), ""], "비밀번호가 일치하지 않습니다.")
}).required();

function ChangePassword() {
  const navigator = useNavigate();
  const [searchParams] = useSearchParams();

  const {
    formState: { errors },
    register,
    setError,
    trigger,
    watch
  } = useForm({
    mode: "onChange",
    resolver: yupResolver(changePasswordSchema)
  });

  const [canProceed, setCanProceed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [pw, checkedPw] = watch(["pw", "checkedPw"]);
  const doneButtonDisable = !pw || !checkedPw || Object.keys(errors).length > 0;
  const no = searchParams.get("no");
  const uuid = searchParams.get("uuid");

  const handleChangePassword = async () => {
    if (doneButtonDisable || !no || !uuid) {
      return;
    }

    try {
      setIsLoading(true);
      await putChangePw({
        checkedPw,
        no,
        pw,
        uuid
      });

      setCanProceed(true);
    } catch (e) {
      setError("pw", {
        message:
          checkObjectType(e) && "errorCode" in e
            ? (e.errorMessage as string)
            : "예기치 못한 오류가 발생했습니다."
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!no || !uuid) {
      navigator("/");
    }
  }, [navigator, no, uuid]);

  return (
    <>
      {canProceed ? (
        <>
          <div className={"flex flex-col items-center gap-8"}>
            <h1 className={classNames("text-center text-3xl font-semibold")}>
              비밀번호 변경 완료
            </h1>
            <CircleCheckIcon
              className={"stroke-talearnt-Primary_01"}
              size={70}
            />
            <div
              className={classNames(
                "flex items-center justify-center",
                "w-full rounded-xl border border-talearnt-Line_01 bg-talearnt-BG_Up_01 py-[31px]"
              )}
            >
              <span className={"text-base font-medium"}>
                비밀번호가 성공적으로 변경되었습니다.
              </span>
            </div>
          </div>
          <div className={"flex gap-[30px]"}>
            <Button
              buttonStyle={"outlined"}
              className={"h-[50px] w-full"}
              onClick={() => navigator("/")}
            >
              홈으로
            </Button>
            <Button
              className={"h-[50px] w-full"}
              onClick={() => navigator("/sign-in")}
            >
              로그인
            </Button>
          </div>
        </>
      ) : (
        <>
          <h1 className={classNames("text-center text-3xl font-semibold")}>
            새 비밀번호를 입력해 주세요
          </h1>
          <div className={"flex flex-col gap-6"}>
            <Input
              error={errors.pw?.message}
              formData={{
                ...register("pw", {
                  onChange: () => trigger("checkedPw")
                })
              }}
              label={"새 비밀번호"}
              placeholder={
                "영문, 숫자, 특수문자의 조합 8자리 이상 입력해 주세요"
              }
              type={"password"}
            />
            <Input
              error={errors.checkedPw?.message}
              formData={{ ...register("checkedPw") }}
              insideNode={
                checkedPw && !errors.checkedPw ? (
                  <LabelText>확인</LabelText>
                ) : undefined
              }
              label={"새 비밀번호 확인"}
              placeholder={"비밀번호를 한 번 더 입력해 주세요"}
              type={"password"}
            />
          </div>
          <Button disabled={doneButtonDisable} onClick={handleChangePassword}>
            {isLoading ? <Spinner /> : "확인"}
          </Button>
        </>
      )}
    </>
  );
}

export default ChangePassword;
