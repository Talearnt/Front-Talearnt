import { ReactNode } from "react";

import dayjs from "dayjs";

import { classNames } from "@utils/classNames";

import { useGetProfile } from "@hook/user.hook";

import { Avatar } from "@components/Avatar/Avatar";

import { profileType } from "@type/user.type";

type UserContentSectionProps = Pick<profileType, "profileImg"> & {
  authorNickname: string;
  createdAt: string;
  content: string;
  children?: ReactNode;
  deletedData?: {
    isDeleted: boolean | undefined;
    deletedText?: string;
  };
};

function UserContentSection({
  profileImg,
  createdAt,
  authorNickname,
  content,
  children,
  deletedData
}: UserContentSectionProps) {
  const {
    data: {
      data: { nickname }
    }
  } = useGetProfile();

  return deletedData?.isDeleted ? (
    <span
      className={classNames(
        "rounded-xl bg-talearnt_BG_Up_01 p-4",
        "text-body2_16_medium text-talearnt_Text_03"
      )}
    >
      {deletedData.deletedText ?? "작성자가 삭제한 댓글입니다."}
    </span>
  ) : (
    <div className={"flex gap-4"}>
      <Avatar imageUrl={profileImg} />
      <div className={classNames("flex flex-col gap-2", "w-full")}>
        <div className={"flex items-center gap-2"}>
          <span className={"text-body2_16_semibold text-talearnt_Text_01"}>
            {authorNickname}
          </span>
          {authorNickname === nickname && (
            <span
              className={classNames(
                "rounded-full border border-talearnt_Error_01 px-[7px] py-[3px]",
                "text-caption2_12_semibold text-talearnt_Error_01"
              )}
            >
              작성자
            </span>
          )}
          <div className={"mx-2 h-[20px] w-px bg-talearnt_Line_01"} />
          <time
            className={"text-caption1_14_medium text-talearnt_Text_03"}
            dateTime={dayjs(createdAt).format("YYYY.MM.DD")}
          >
            {dayjs(createdAt).format("YYYY.MM.DD")}
          </time>
          <time
            className={"text-caption1_14_medium text-talearnt_Text_03"}
            dateTime={dayjs(createdAt).format("HH:MM")}
          >
            {dayjs(createdAt).format("HH:MM")}
          </time>
        </div>
        <p className={"text-body2_16_medium text-talearnt_Text_02"}>
          {content}
        </p>
        {children}
      </div>
    </div>
  );
}

export { UserContentSection };
