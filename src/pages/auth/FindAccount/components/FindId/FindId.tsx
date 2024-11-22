import { classNames } from "@utils/classNames";

import { Button } from "@components/Button/Button";
import { Input } from "@components/Input/Input";

function FindId() {
  return (
    <div className={classNames("flex flex-col gap-6", "mb-10")}>
      <Input label={"휴대폰 본인인증"}>
        <Button buttonStyle={"outlined"} className={"ml-2 w-[150px] shrink-0"}>
          인증번호 요청
        </Button>
      </Input>
      <Input label={"인증번호 확인"}>
        <Button buttonStyle={"outlined"} className={"ml-2 w-[95px] shrink-0"}>
          확인
        </Button>
      </Input>
      <Button className={"mt-4"}>아이디 찾기</Button>
    </div>
  );
}

export default FindId;
