import { useState } from "react";
import { useForm } from "react-hook-form";

import { yupResolver } from "@hookform/resolvers/yup";
import { object, string } from "yup";

import {
  postConfirmVerificationCode,
  postSendVerificationCode
} from "@pages/auth/api/auth.api";

import { checkObjectType } from "@utils/checkObjectType";
import { classNames } from "@utils/classNames";

import { Button } from "@components/Button/Button";
import { Input } from "@components/Input/Input";
import { VerificationCode } from "@pages/auth/components/VerificationCode/VerificationCode";

import { verificationStateType } from "@pages/auth/api/auth.type";

const findIdSchema = object({
  name: string().matches(
    /^$|^[가-힣]{2,5}$/,
    "이름은 최소 2글자에서 최대 5글자까지, 한글만 입력 가능합니다."
  )
}).required();

function FindId() {
  const {
    formState: { errors },
    register,
    watch
  } = useForm({
    mode: "onChange",
    resolver: yupResolver(findIdSchema)
  });

  const [verification, setVerification] = useState<verificationStateType>({
    isCodeVerified: false
  });

  const [name] = watch(["name"]);

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

      console.log(data);

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
    if (!name) {
      return;
    }

    await postSendVerificationCode({ name, phone, type: "findId" });
  };

  return (
    <>
      <p className={classNames("text-center text-3xl font-semibold")}>
        가입 시 등록한 휴대폰 정보로
        <br />
        아이디를 찾을 수 있어요
      </p>
      <div className={classNames("flex flex-col gap-6")}>
        <Input
          error={errors.name?.message}
          formData={{ ...register("name") }}
          label={"이름"}
          placeholder={"이름을 입력해 주세요"}
        />
        <VerificationCode
          confirmCodeHandler={handleConfirmCode}
          isSendButtonDisabled={!!errors.name}
          sendCodeHandler={handleSendCode}
          verificationState={[verification, setVerification]}
        />
      </div>
      <Button disabled={!verification.isCodeVerified}>아이디 찾기</Button>
    </>
  );
}

export default FindId;
