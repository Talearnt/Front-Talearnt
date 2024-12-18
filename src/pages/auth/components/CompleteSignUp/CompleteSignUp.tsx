import { useNavigate } from "react-router-dom";

import { classNames } from "@utils/classNames";

import { Button } from "@components/Button/Button";
import { CircleCheckIcon } from "@components/icons/CircleCheckIcon/CircleCheckIcon";

function CompleteSignUp() {
  const navigator = useNavigate();

  return (
    <>
      <div className={"flex flex-col items-center gap-8"}>
        <h1 className={classNames("text-center text-3xl font-semibold")}>
          성공적으로 가입되었어요
          <br />
          talearnt에서 만나요!
        </h1>
        <CircleCheckIcon className={"stroke-talearnt-Primary_01"} size={70} />
        <p
          className={classNames(
            "flex items-center justify-center",
            "rounded-xl border border-talearnt-Line_01",
            "h-[5.25rem] w-full bg-talearnt-BG_Up_01",
            "font-medium"
          )}
        >
          로그인하시면 더욱 다양한 서비스를 제공 받으실 수 있습니다.
        </p>
      </div>
      <div className={classNames("flex gap-[30px]")}>
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
  );
}

export default CompleteSignUp;