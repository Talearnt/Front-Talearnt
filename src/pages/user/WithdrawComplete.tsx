import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { useQueryClient } from "@tanstack/react-query";
import dayjs from "dayjs";

import { QueryKeyFactory } from "@shared/cache/queryKeys/queryKeyFactory";

import { classNames } from "@shared/utils/classNames";

import { useAuthStore } from "@store/user.store";

import { Button } from "@components/common/Button/Button";
import { CircleCheckIcon } from "@components/common/icons/CircleCheckIcon/CircleCheckIcon";

import { withdrawalResponseType } from "@features/user/withdrawAccount/withdrawAccount.type";

function WithdrawComplete() {
  const navigator = useNavigate();
  const { userId, withdrawnAt } = useLocation().state as withdrawalResponseType;

  const queryClient = useQueryClient();

  const setAccessToken = useAuthStore(state => state.setAccessToken);

  useEffect(() => {
    /** 사용자 관련 캐시 제거 */
    queryClient.removeQueries({ queryKey: QueryKeyFactory.user.all() });
    setAccessToken(null);
  }, [queryClient, setAccessToken]);

  return (
    <div
      className={classNames(
        "flex flex-col items-center",
        "mt-[96px] w-[632px] space-y-6"
      )}
    >
      <h1 className={"text-center text-heading1_30_semibold"}>
        회원 탈퇴가 완료되었어요
      </h1>
      <CircleCheckIcon className={"stroke-talearnt_Primary_01"} size={70} />
      <div
        className={classNames(
          "flex flex-col items-center justify-center",
          "w-full rounded-xl border border-talearnt_Line_01 bg-talearnt_BG_Up_01 px-[23px] py-[31px]"
        )}
      >
        <p
          className={classNames(
            "mb-4",
            "text-center text-body2_16_medium text-talearnt_Text_02"
          )}
        >
          잭재기님과 함께한 시간, 저희는 절대 잊지 않을게요.
          <br /> 탤런트는 언제나, 여러분의 성장을 응원하겠습니다!
          <br />
          <br />
          혹시라도 다시 돌아오고 싶으시다면, 7일 후 재가입이 가능해요!
          <br /> 다시 돌아오실 땐, 더 좋아진 모습으로 맞이할게요! 기다리고
          있겠습니다.
        </p>
        <span
          className={classNames(
            "mb-1",
            "text-caption1_14_medium text-talearnt_Primary_01"
          )}
        >
          탈퇴일자: {dayjs(withdrawnAt).format("YYYY.MM.DD HH:mm")}
        </span>
        <span className={"text-caption1_14_medium text-talearnt_Primary_01"}>
          탈퇴계정: {userId}
        </span>
      </div>
      <Button className={"!mt-14 w-full"} onClick={() => navigator("/")}>
        홈으로
      </Button>
    </div>
  );
}

export default WithdrawComplete;
