import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { object, ref as yupRef, string } from "yup";

import { putChangePw } from "@features/auth/findAccount/findAccount.api";

import { checkObjectType } from "@shared/utils/checkObjectType";
import { classNames } from "@shared/utils/classNames";

import { Button } from "@components/common/Button/Button";
import { CircleCheckIcon } from "@components/common/icons/CircleCheckIcon/CircleCheckIcon";
import { Input } from "@components/common/inputs/Input/Input";
import { LabelText } from "@components/common/LabelText/LabelText";
import { Spinner } from "@components/common/Spinner/Spinner";

import { pwRegex } from "@features/auth/shared/authRegex.constants";

const changePasswordSchema = object({
  pw: string().matches(
    pwRegex,
    "영문, 숫자, 특수 문자를 포함한 8자 이상의 비밀번호를 입력해 주세요."
  ),
  checkedPw: string().oneOf(
    [yupRef("pw"), ""],
    "비밀번호가 일치하지 않습니다."
  ),
}).required();

function ChangePassword() {
  const navigator = useNavigate();
  const [searchParams] = useSearchParams();

  const [canProceed, setCanProceed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    formState: { errors },
    register,
    setError,
    trigger,
    watch,
  } = useForm({
    mode: "onChange",
    resolver: yupResolver(changePasswordSchema),
  });

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
        uuid,
      });

      setCanProceed(true);
    } catch (e) {
      setError("pw", {
        message:
          checkObjectType(e) && "errorCode" in e
            ? (e.errorMessage as string)
            : "예기치 못한 오류가 발생했습니다.",
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
            <h1 className={"text-center text-heading1_30_semibold"}>
              비밀번호 변경 완료
            </h1>
            <CircleCheckIcon
              className={"stroke-talearnt_Primary_01"}
              size={70}
            />
            <div
              className={classNames(
                "flex items-center justify-center",
                "w-full rounded-xl border border-talearnt_Line_01 bg-talearnt_BG_Up_01 py-[31px]"
              )}
            >
              <span className={"text-body2_16_medium"}>
                비밀번호가 성공적으로 변경되었습니다.
              </span>
            </div>
          </div>
          <div className={"flex gap-[30px]"}>
            <Button
              buttonStyle={"outlined"}
              className={"w-full"}
              onClick={() => navigator("/")}
            >
              홈으로
            </Button>
            <Button className={"w-full"} onClick={() => navigator("/sign-in")}>
              로그인
            </Button>
          </div>
        </>
      ) : (
        <>
          <h1 className={"text-center text-heading1_30_semibold"}>
            새 비밀번호를 입력해 주세요
          </h1>
          <div className={"flex flex-col gap-6"}>
            <Input
              error={errors.pw?.message}
              formData={{
                ...register("pw", {
                  onChange: () => trigger("checkedPw"),
                }),
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
