import { classNames } from "@utils/classNames";

import { Button } from "@components/Button/Button";
import { Input } from "@components/Input/Input";

function FindPassword() {
  return (
    <div className={classNames("flex flex-col gap-[40px]")}>
      <Input label={"이메일"} />
      <Button>비밀번호 찾기</Button>
    </div>
  );
}

export default FindPassword;
