import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

import { yupResolver } from "@hookform/resolvers/yup";
import { object, string } from "yup";

import {
  getRandomNickName,
  postConfirmVerificationCode,
  postSendVerificationCode
} from "@pages/auth/api/auth.api";

import { checkObjectType } from "@utils/checkObjectType";
import { classNames } from "@utils/classNames";

import { Button } from "@components/Button/Button";
import { Input } from "@components/Input/Input";
import { TabSlider } from "@components/TabSlider/TabSlider";
import { VerificationCode } from "@pages/auth/components/VerificationCode/VerificationCode";

const genderOptions = [
  {
    label: "남자",
    value: "male"
  },
  {
    label: "여자",
    value: "female"
  }
];

const infoFieldsSchema = object({
  nickName: string().required("닉네임을 입력해 주세요"),
  name: string().required("이름을 입력해 주세요"),
  gender: string().required(),
  userId: string().required("이메일을 입력해 주세요"),
  pw: string().required("비밀번호를 입력해 주세요"),
  checkPw: string().required("비밀번호를 입력해 주세요")
}).required();

function InfoFields() {
  const { register, setValue, watch } = useForm({
    defaultValues: { gender: "male" },
    resolver: yupResolver(infoFieldsSchema)
  });

  const [canProceed, setCanProceed] = useState(false);
  const [isCodeVerified, setIsCodeVerified] = useState(false);

  const [nickName, name, gender, userId, pw, checkPw] = watch([
    "nickName",
    "name",
    "gender",
    "userId",
    "pw",
    "checkPw"
  ]);
  const doneButtonDisable =
    !nickName || !name || !userId || !pw || !checkPw || pw !== checkPw;

  useEffect(() => {
    // nickName 인풋에 random nickname 적용
    getRandomNickName()
      .then(({ data: { data } }) => {
        setValue("nickName", data);
      })
      .catch(() => {
        setValue("nickName", "");
      });
  }, [setValue]);

  return (
    <>
      <div className={"flex flex-col gap-6"}>
        {canProceed ? (
          <>
            <Input
              formData={{ ...register("nickName") }}
              label={"닉네임"}
              placeholder={"닉네임을 입력해 주세요"}
            />
            <Input
              formData={{ ...register("name") }}
              label={"이름"}
              placeholder={"이름을 입력해 주세요."}
            >
              <TabSlider
                className={classNames("ml-2", "w-[160px]")}
                currentValue={gender}
                onChangeHandler={value => setValue("gender", value)}
                options={genderOptions}
              />
            </Input>
            <Input
              formData={{ ...register("userId") }}
              label={"아이디(이메일)"}
              placeholder={"이메일을 입력해 주세요"}
            />
            <Input
              formData={{ ...register("pw") }}
              label={"비밀번호"}
              placeholder={
                "영문, 숫자, 특수문자의 조합 8자리 이상 입력해 주세요"
              }
              type={"password"}
            />
            <Input
              formData={{ ...register("checkPw") }}
              label={"비밀번호 확인"}
              placeholder={"비밀번호를 한 번 더 입력해 주세요"}
              type={"password"}
            />
            <Button
              className={"mt-[32px]"}
              disabled={doneButtonDisable}
              onClick={() => console.log("가입")}
            >
              가입하기
            </Button>
          </>
        ) : (
          <>
            <VerificationCode
              confirmCodeHandler={async ({ phone, verificationCode }) => {
                try {
                  await postConfirmVerificationCode({
                    type: "signUp",
                    phone,
                    code: verificationCode
                  });
                  return true;
                } catch (e) {
                  if (checkObjectType(e) && "errorCode" in e) {
                    return e.errorCode === "400-AUTH-05"
                      ? "400-AUTH-05"
                      : (e.errorMessage as string);
                  }
                  return "예기치 못한 오류가 발생했습니다.";
                }
              }}
              sendCodeHandler={async phone => {
                await postSendVerificationCode({ phone, type: "signUp" });
              }}
              verifiedState={[isCodeVerified, setIsCodeVerified]}
            />
            <Button
              className={"mt-[32px]"}
              disabled={!isCodeVerified}
              onClick={() => setCanProceed(true)}
            >
              다음
            </Button>
          </>
        )}
      </div>
    </>
  );
}

export default InfoFields;
