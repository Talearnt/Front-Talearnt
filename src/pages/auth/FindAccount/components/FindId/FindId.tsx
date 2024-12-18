import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

import { yupResolver } from "@hookform/resolvers/yup";
import dayjs from "dayjs";
import { object, string } from "yup";

import {
  postConfirmVerificationCode,
  postSendVerificationCode
} from "@pages/auth/api/auth.api";

import { checkObjectType } from "@utils/checkObjectType";
import { classNames } from "@utils/classNames";

import { Button } from "@components/Button/Button";
import { CircleCheckIcon } from "@components/icons/CircleCheckIcon/CircleCheckIcon";
import { Input } from "@components/Input/Input";
import { VerificationCode } from "@pages/auth/components/VerificationCode/VerificationCode";

import { nameRegex } from "@pages/auth/common/common.constants";

import {
  findIdResponseType,
  verificationStateType
} from "@pages/auth/api/auth.type";

const findIdSchema = object({
  name: string().matches(
    nameRegex,
    "이름은 최소 2글자에서 최대 5글자까지, 한글만 입력 가능합니다."
  )
}).required();

function FindId() {
  const navigator = useNavigate();
  const idData = useRef<findIdResponseType>({
    userId: "",
    createdAt: ""
  });

  const {
    formState: { errors },
    register,
    watch
  } = useForm({
    mode: "onChange",
    resolver: yupResolver(findIdSchema)
  });

  const [canProceed, setCanProceed] = useState(false);
  const [verification, setVerification] = useState<verificationStateType>({
    isCodeVerified: false
  });

  const [name] = watch(["name"]);
  const buttonDisable = !name || !!errors.name;

  const handleConfirmCode = async ({
    phone,
    verificationCode
  }: {
    phone: string;
    verificationCode: string;
  }) => {
    try {
      const { data } = await postConfirmVerificationCode({
        type: "findId",
        phone,
        code: verificationCode
      });

      idData.current = data as findIdResponseType;

      return true;
    } catch (e) {
      if (checkObjectType(e) && "errorCode" in e) {
        return e.errorCode === "400-AUTH-05"
          ? "400-AUTH-05"
          : (e.errorMessage as string);
      }

      return "예기치 못한 오류가 발생했습니다.";
    }
  };

  const handleSendCode = async (phone: string) => {
    if (buttonDisable) {
      return;
    }

    await postSendVerificationCode({ name, phone, type: "findId" });
  };

  return (
    <>
      {canProceed ? (
        <>
          <div className={"flex flex-col items-center gap-8"}>
            <h1 className={classNames("text-center text-3xl font-semibold")}>
              아이디 찾기 완료
            </h1>
            <CircleCheckIcon
              className={"stroke-talearnt-Primary_01"}
              size={70}
            />
            <div
              className={classNames(
                "flex flex-col items-center gap-6",
                "w-full"
              )}
            >
              <span className={"text-base font-medium"}>
                아이디 찾기 결과 고객님의 아이디 정보는 아래와 같아요
              </span>
              <div
                className={classNames(
                  "flex flex-col items-center justify-center gap-2",
                  "w-full rounded-xl border border-talearnt-Line_01 bg-talearnt-BG_Up_01 py-[31px]"
                )}
              >
                <span className={"text-base font-medium"}>
                  고객님 아이디는
                  <b className={"font-semibold"}>
                    {idData.current.userId.split("@")[0].slice(0, -3)}***@
                    {idData.current.userId.split("@")[1]}
                  </b>
                  입니다.
                </span>
                <span className={"text-sm font-medium text-talearnt-Error_01"}>
                  {dayjs(idData.current.createdAt).format("YYYY-MM-DD HH:mm")}에
                  가입함
                </span>
              </div>
              <div
                className={classNames(
                  "flex items-center justify-between",
                  "w-full"
                )}
              >
                <span className={classNames("ml-4", "text-lg font-medium")}>
                  010-****-{verification.phone?.slice(-4)}
                </span>
                <span
                  className={classNames(
                    "flex items-center justify-center",
                    "h-[50px] w-[160px] rounded-lg border border-talearnt-Icon_02",
                    "text-lg font-medium text-talearnt-Text_04"
                  )}
                >
                  아이디 발송됨
                </span>
              </div>
            </div>
          </div>
          <div className={"flex gap-[30px]"}>
            <Button
              buttonStyle={"outlined"}
              className={"h-[50px] w-full"}
              onClick={() => navigator("/find-account/pw")}
            >
              비밀번호 찾기
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
            가입 시 등록한 휴대폰 정보로
            <br />
            아이디를 찾을 수 있어요
          </h1>
          <div className={classNames("flex flex-col gap-6")}>
            <Input
              error={errors.name?.message}
              formData={{ ...register("name") }}
              label={"이름"}
              placeholder={"이름을 입력해 주세요"}
            />
            <VerificationCode
              confirmCodeHandler={handleConfirmCode}
              isSendButtonDisabled={buttonDisable}
              sendCodeHandler={handleSendCode}
              verificationState={[verification, setVerification]}
            />
          </div>
          <Button
            disabled={!verification.isCodeVerified}
            onClick={() => setCanProceed(true)}
          >
            아이디 찾기
          </Button>
        </>
      )}
    </>
  );
}

export default FindId;
