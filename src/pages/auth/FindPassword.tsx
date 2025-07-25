import { useRef, useState } from "react";

import { yupResolver } from "@hookform/resolvers/yup";
import dayjs from "dayjs";
import { useForm } from "react-hook-form";
import { object, string } from "yup";

import { postFindPwEmail } from "@features/auth/findAccount/findAccount.api";

import { checkObjectType } from "@shared/utils/checkObjectType";
import { classNames } from "@shared/utils/classNames";

import { Button } from "@components/common/Button/Button";
import { CircleCheckIcon } from "@components/common/icons/CircleCheckIcon/CircleCheckIcon";
import { Input } from "@components/common/inputs/Input/Input";
import { Spinner } from "@components/common/Spinner/Spinner";

import { userIdRegex } from "@features/auth/shared/authRegex.constants";

const findIdSchema = object({
  phone: string().matches(
    /^[0-9]*$/,
    "올바른 전화번호 형식이 아닙니다. 숫자만 입력해 주세요."
  ),
  userId: string().matches(userIdRegex, "올바른 이메일 형식으로 입력해 주세요"),
}).required();

function FindPassword() {
  const sentDateRef = useRef<string>("");

  const [canProceed, setCanProceed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    formState: { errors },
    register,
    setError,
    watch,
  } = useForm({
    mode: "onChange",
    resolver: yupResolver(findIdSchema),
  });

  const [phone, userId] = watch(["phone", "userId"]);
  const buttonDisable =
    !userId || phone?.length !== 11 || Object.keys(errors).length > 0;

  const handleFindPassword = async () => {
    if (buttonDisable) {
      return;
    }

    try {
      setIsLoading(true);
      const { data } = await postFindPwEmail({
        phone,
        userId,
      });

      sentDateRef.current = data.sentDate;

      setCanProceed(true);
    } catch (e) {
      setError("phone", {
        message:
          checkObjectType(e) && "errorCode" in e
            ? (e.errorMessage as string)
            : "예기치 못한 오류가 발생했습니다.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {canProceed ? (
        <div className={"flex flex-col items-center gap-8"}>
          <h1 className={"text-center text-heading1_30_semibold"}>
            비밀번호 재설정 링크 발송 완료
          </h1>
          <CircleCheckIcon className={"stroke-talearnt_Primary_01"} size={70} />
          <div
            className={classNames(
              "flex flex-col items-center justify-center gap-2",
              "w-full rounded-xl border border-talearnt_Line_01 bg-talearnt_BG_Up_01 py-[31px]"
            )}
          >
            <span className={"text-center text-body2_16_medium"}>
              <b className={"font-semibold"}>
                {userId?.split("@")[0].slice(0, -3)}***@
                {userId?.split("@")[1]}
              </b>
              으로 <br />
              비밀번호 재설정을 위한 인증 메일을 발송하였습니다.
            </span>
            <span className={"text-caption1_14_medium text-talearnt_Error_01"}>
              {dayjs(sentDateRef.current).format("YYYY-MM-DD HH:mm")}에 메일
              발송함
            </span>
          </div>
        </div>
      ) : (
        <>
          <h1 className={"text-center text-heading1_30_semibold"}>
            본인 확인을 통해
            <br />
            비밀번호를 재설정할 수 있어요
          </h1>
          <div className={"flex flex-col gap-6"}>
            <Input
              error={errors.userId?.message}
              formData={{ ...register("userId") }}
              label={"이메일"}
              placeholder={"이메일을 입력해 주세요"}
            />
            <Input
              error={errors.phone?.message}
              formData={{ ...register("phone") }}
              label={"휴대폰 번호"}
              maxLength={11}
              placeholder={"01012345678"}
            />
          </div>
          <Button
            disabled={
              !userId || phone?.length !== 11 || Object.keys(errors).length > 0
            }
            onClick={handleFindPassword}
          >
            {isLoading ? <Spinner /> : "비밀번호 찾기"}
          </Button>
        </>
      )}
    </>
  );
}

export default FindPassword;
