import { classNames } from "@shared/utils/classNames";
import { filteredTalents } from "@shared/utils/filteredTalents";

import { useGetProfile } from "@features/user/user.hook";

import { Badge } from "@components/common/Badge/Badge";
import { ChatIcon } from "@components/common/icons/styled/ChatIcon";
import { HeartIcon } from "@components/common/icons/styled/HeartIcon";
import { NoteIcon } from "@components/common/icons/styled/NoteIcon";
import { Avatar } from "@components/shared/Avatar/Avatar";
import { AvatarDecoration } from "@components/user/profile/AvatarDecoration";

function Profile() {
  const {
    data: {
      data: { nickname, profileImg, giveTalents, receiveTalents },
    },
  } = useGetProfile();

  const giveTalentsList = filteredTalents(giveTalents);
  const receiveTalentsList = filteredTalents(receiveTalents);
  const profileButtons = [
    {
      label: "찜 목록",
      icon: <HeartIcon iconType="filled-blue" size={24} />,
      count: 0,
    },
    {
      label: "작성한 게시물",
      icon: <NoteIcon iconType="filled-blue" size={24} />,
      count: 0,
    },
    {
      label: "작성한 댓글",
      icon: <ChatIcon iconType="filled-blue" size={24} />,
      count: 0,
    },
  ];

  return (
    <div className={"flex flex-col gap-14"}>
      <div className={"flex flex-col gap-4"}>
        <div className={"flex items-center justify-between"}>
          <span className={"text-heading3_22_semibold text-talearnt_Text_01"}>
            내 프로필
          </span>
          <button
            className={classNames(
              "h-10 rounded-lg px-3",
              "text-body1_18_medium text-talearnt_Text_03",
              "hover:bg-talearnt_BG_Up_01 hover:text-talearnt_Text_02"
            )}
          >
            프로필 수정
          </button>
        </div>
        <div
          className={classNames(
            "flex flex-col gap-6",
            "rounded-2xl border border-talearnt_Line_01 p-[23px]"
          )}
        >
          <div className={"flex flex-col items-center gap-4"}>
            <div className={"relative"}>
              <Avatar imageUrl={profileImg} size={100} />
              <AvatarDecoration
                className={"absolute -top-6 left-1/2 -translate-x-1/2"}
              />
            </div>
            <div className={"flex flex-col items-center"}>
              <div className={"flex items-center"}>
                <span
                  className={"text-heading2_24_semibold text-talearnt_Text_01"}
                >
                  {nickname}
                </span>
                <span
                  className={"text-heading4_20_semibold text-talearnt_Text_01"}
                >
                  님,
                </span>
              </div>
              <p className={"text-body1_18_medium text-talearnt_Text_02"}>
                오늘도 좋은 하루 되세요♥
              </p>
            </div>
          </div>
          <div className={"flex flex-col gap-2"}>
            <span className={"text-body2_16_semibold text-talearnt_Text_01"}>
              주고 싶은 나의 재능
            </span>
            <div className={"flex gap-3"}>
              {giveTalentsList.map(({ talentCode, talentName }) => (
                <Badge
                  label={talentName}
                  type={"keyword"}
                  size={"medium"}
                  key={talentCode}
                />
              ))}
            </div>
          </div>
          <div className={"h-px w-full bg-talearnt_Line_01"} />
          <div className={"flex flex-col gap-2"}>
            <span className={"text-body2_16_semibold text-talearnt_Text_01"}>
              받고 싶은 나의 재능
            </span>
            <div className={"flex gap-3"}>
              {receiveTalentsList.map(({ talentCode, talentName }) => (
                <Badge
                  label={talentName}
                  type={"keyword"}
                  size={"medium"}
                  key={talentCode}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className={"flex flex-col gap-4"}>
        <span
          className={
            "text-heading3_22_semibold leading-[40px] text-talearnt_Text_01"
          }
        >
          내 프로필
        </span>
        <div className={"grid grid-cols-3 gap-5"}>
          {profileButtons.map(({ label, icon, count }) => (
            <button
              key={label}
              className={classNames(
                "flex flex-col gap-[14px]",
                "rounded-2xl border border-talearnt_Line_01 p-[23px]",
                "hover:bg-talearnt_BG_Up_01"
              )}
            >
              <div className={"flex items-center justify-between"}>
                <span
                  className={"text-body2_16_semibold text-talearnt_Text_01"}
                >
                  {label}
                </span>
                {icon}
              </div>
              <span
                className={
                  "text-left text-heading2_24_semibold text-talearnt_Text_01"
                }
              >
                {count}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Profile;
