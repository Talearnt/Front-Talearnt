import { classNames } from "@shared/utils/classNames";

import {
  useGetNotificationSetting,
  usePutNotificationSetting,
} from "@features/user/notificationSetting/notificationSetting.hook";

import { Toggle } from "@components/common/Toggle/Toggle";

function NotificationSetting() {
  const {
    data: {
      data: { allowCommentNotifications, allowKeywordNotifications },
    },
  } = useGetNotificationSetting();
  const { mutate, isPending } = usePutNotificationSetting();

  return (
    <div className={"flex flex-col gap-4"}>
      <span
        className={
          "text-heading3_22_semibold leading-[40px] text-talearnt_Text_01"
        }
      >
        알림 설정
      </span>
      <div
        className={classNames(
          "flex flex-col gap-6",
          "rounded-[20px] border border-talearnt_Line_01 p-[23px]"
        )}
      >
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-2">
            <span className="text-heading4_20_semibold text-talearnt_Text_01">
              알림 전체 허용
            </span>
            <span className="text-body1_18_medium text-talearnt_Text_03">
              허용 시 푸시 알림으로 안내해드려요
            </span>
          </div>
          <Toggle
            disabled={isPending}
            checked={allowCommentNotifications && allowKeywordNotifications}
            onChange={({ target: { checked } }) => {
              if (isPending) return;
              mutate({
                allowCommentNotifications: checked,
                allowKeywordNotifications: checked,
              });
            }}
          />
        </div>
        <div className="h-px w-full bg-talearnt_Line_01" />
        <div className="flex items-center justify-between">
          <span className="text-heading4_20_semibold text-talearnt_Text_01">
            댓글 알림 허용
          </span>
          <Toggle
            disabled={isPending}
            checked={allowCommentNotifications}
            onChange={({ target: { checked } }) => {
              if (isPending) return;
              mutate({
                allowCommentNotifications: checked,
                allowKeywordNotifications,
              });
            }}
          />
        </div>
        <div className="flex items-center justify-between">
          <span className="text-heading4_20_semibold text-talearnt_Text_01">
            관심 키워드 알림 허용
          </span>
          <Toggle
            disabled={isPending}
            checked={allowKeywordNotifications}
            onChange={({ target: { checked } }) => {
              if (isPending) return;
              mutate({
                allowCommentNotifications,
                allowKeywordNotifications: checked,
              });
            }}
          />
        </div>
      </div>
    </div>
  );
}

export default NotificationSetting;
