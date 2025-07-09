import { useState } from "react";

import { classNames } from "@shared/utils/classNames";

import {
  useGetActivityCounts,
  useGetProfile,
} from "@features/user/profile/profile.hook";

import { ChatIcon } from "@components/common/icons/styled/ChatIcon";
import { HeartIcon } from "@components/common/icons/styled/HeartIcon";
import { NoteIcon } from "@components/common/icons/styled/NoteIcon";
import { ProfileEditForm } from "@components/user/profile/ProfileEditForm";
import { ProfileView } from "@components/user/profile/ProfileView";

import { profileType } from "@features/user/profile/profile.type";

function Profile() {
  const [isEditProfile, setIsEditProfile] = useState(false);
  const [editProfileData, setEditProfileData] = useState<
    Omit<profileType, "userNo" | "userId">
  >({
    nickname: "",
    profileImg: "",
    giveTalents: [],
    receiveTalents: [],
  });

  const {
    data: {
      data: { nickname, profileImg, giveTalents, receiveTalents },
    },
  } = useGetProfile();
  const {
    data: {
      data: { favoritePostCount, myPostCount, myCommentCount },
    },
  } = useGetActivityCounts();

  const profileButtons = [
    {
      label: "찜 목록",
      icon: <HeartIcon iconType="filled-blue" size={24} />,
      count: favoritePostCount,
    },
    {
      label: "작성한 게시물",
      icon: <NoteIcon iconType="filled-blue" size={24} />,
      count: myPostCount,
    },
    {
      label: "작성한 댓글",
      icon: <ChatIcon iconType="filled-blue" size={24} />,
      count: myCommentCount,
    },
  ];

  return (
    <div className={"flex flex-col gap-14"}>
      <div className={"flex flex-col gap-4"}>
        <div className={"flex items-center justify-between"}>
          <span
            className={
              "text-heading3_22_semibold leading-[40px] text-talearnt_Text_01"
            }
          >
            내 프로필
          </span>
          {!isEditProfile && (
            <button
              className={classNames(
                "h-10 rounded-lg px-3",
                "text-body1_18_medium text-talearnt_Text_03",
                "hover:bg-talearnt_BG_Up_01 hover:text-talearnt_Text_02"
              )}
              onClick={() => {
                setIsEditProfile(true);
                setEditProfileData({
                  nickname,
                  profileImg,
                  giveTalents,
                  receiveTalents,
                });
              }}
            >
              프로필 수정
            </button>
          )}
        </div>
        <div
          className={classNames(
            "flex flex-col gap-6",
            "rounded-2xl border border-talearnt_Line_01 p-[23px]"
          )}
        >
          {isEditProfile ? (
            <ProfileEditForm
              originalProfileData={{
                profileImg,
                nickname,
                giveTalents,
                receiveTalents,
              }}
              editProfileData={editProfileData}
              setEditProfileData={setEditProfileData}
              setIsEditProfile={setIsEditProfile}
            />
          ) : (
            <ProfileView
              profileImg={profileImg}
              nickname={nickname}
              giveTalents={giveTalents}
              receiveTalents={receiveTalents}
            />
          )}
        </div>
      </div>
      <div className={"flex flex-col gap-4"}>
        <span
          className={
            "text-heading3_22_semibold leading-[40px] text-talearnt_Text_01"
          }
        >
          내 활동
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
