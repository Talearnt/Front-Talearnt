import { findTalentList } from "@shared/utils/findTalent";

import { Badge } from "@components/common/Badge/Badge";
import { Avatar } from "@components/shared/Avatar/Avatar";
import { AvatarDecoration } from "@components/user/profile/AvatarDecoration";

import { profileType } from "@features/user/user.type";

function ProfileView({
  profileImg,
  nickname,
  giveTalents,
  receiveTalents,
}: Omit<profileType, "userId" | "userNo">) {
  const giveTalentsList = findTalentList(giveTalents);
  const receiveTalentsList = findTalentList(receiveTalents);

  return (
    <>
      <div className={"flex flex-col items-center gap-4"}>
        <div className={"relative"}>
          <Avatar imageUrl={profileImg} size={100} />
          <AvatarDecoration
            className={"absolute -top-6 left-1/2 -translate-x-1/2"}
          />
        </div>
        <div className={"flex flex-col items-center"}>
          <div className={"flex items-center"}>
            <span className={"text-heading2_24_semibold text-talearnt_Text_01"}>
              {nickname}
            </span>
            <span className={"text-heading4_20_semibold text-talearnt_Text_01"}>
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
              color={"blue"}
              rounded={"md"}
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
              color={"darkgray"}
              rounded={"md"}
              size={"medium"}
              key={talentCode}
            />
          ))}
        </div>
      </div>
    </>
  );
}

export { ProfileView };
