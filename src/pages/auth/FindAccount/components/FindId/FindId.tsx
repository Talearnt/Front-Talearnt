import { useForm } from "react-hook-form";

import { yupResolver } from "@hookform/resolvers/yup";
import { object, string } from "yup";

import { postSendVerificationCode } from "@pages/auth/api/auth.api";

import { classNames } from "@utils/classNames";

import { Button } from "@components/Button/Button";
import { Input } from "@components/Input/Input";

const findIdSchema = object({
  name: string(),
  phone: string()
}).required();

function FindId() {
  const { register, watch } = useForm({
    resolver: yupResolver(findIdSchema)
  });

  const [name, phone] = watch(["name", "phone"]);
  const hasRequiredData = !!name && !!phone && phone.length === 11;

  return (
    <>
      <p className={classNames("text-center text-3xl font-semibold")}>
        가입 시 등록한 휴대폰 정보로
        <br />
        아이디를 찾을 수 있어요
      </p>
      <div className={classNames("flex flex-col gap-6")}>
        <Input
          formData={{ ...register("name") }}
          label={"이름"}
          placeholder={"이름을 입력해 주세요"}
        />
        <Input
          formData={{ ...register("phone") }}
          label={"휴대폰 본인인증"}
          placeholder={"01012345678"}
        >
          <Button
            buttonStyle={"outlined-blue"}
            className={"ml-2 w-[160px] shrink-0"}
            disabled={!hasRequiredData}
            onClick={async () => {
              if (!phone) {
                return;
              }

              await postSendVerificationCode({ type: "아이디찾기", phone });
            }}
          >
            인증번호 요청
          </Button>
        </Input>
        <Input
          label={"인증번호 확인"}
          placeholder={"인증번호 4자리를 입력해 주세요"}
        >
          <Button buttonStyle={"outlined"} className={"ml-2 w-[95px] shrink-0"}>
            확인
          </Button>
        </Input>
      </div>
      <Button>아이디 찾기</Button>
    </>
  );
}

export default FindId;
