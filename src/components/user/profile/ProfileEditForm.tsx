import { Dispatch, SetStateAction } from "react";

import { classNames } from "@shared/utils/classNames";

import { useToastStore } from "@store/toast.store";

import { Button } from "@components/common/Button/Button";
import { DropdownSearchable } from "@components/common/dropdowns/DropdownSearchable/DropdownSearchable";
import { Input } from "@components/common/inputs/Input/Input";
import { Avatar } from "@components/shared/Avatar/Avatar";

import { talentsOptions } from "@shared/constants/talentsOptions";

import { profileType } from "@features/user/user.type";

type ProfileEditFormProps = Omit<profileType, "userNo"> & {
  setEditProfileData: Dispatch<SetStateAction<Omit<profileType, "userNo">>>;
  setIsEditProfile: Dispatch<SetStateAction<boolean>>;
};

function ProfileEditForm({
  profileImg,
  nickname,
  giveTalents,
  receiveTalents,
  setEditProfileData,
  setIsEditProfile,
}: ProfileEditFormProps) {
  const setToast = useToastStore(state => state.setToast);

  return (
    <>
      <label
        className={classNames("relative", "mx-auto w-fit", "cursor-pointer")}
      >
        <Avatar imageUrl={profileImg} size={100} />
        <svg
          className={"absolute bottom-0 right-0"}
          width="33"
          height="32"
          viewBox="0 0 33 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect x="0.5" width="32" height="32" rx="16" fill="#1B76FF" />
          <path
            d="M8.16666 12.9813C8.16666 12.6894 8.16666 12.5434 8.17884 12.4205C8.29632 11.2347 9.23438 10.2967 10.4202 10.1792C10.5431 10.167 10.697 10.167 11.0046 10.167C11.1232 10.167 11.1825 10.167 11.2328 10.1639C11.8755 10.125 12.4383 9.71939 12.6784 9.12199C12.6972 9.07521 12.7148 9.02247 12.75 8.91699C12.7851 8.81152 12.8027 8.75878 12.8215 8.71199C13.0617 8.11459 13.6245 7.70897 14.2672 7.67004C14.3175 7.66699 14.3731 7.66699 14.4843 7.66699H18.5157C18.6269 7.66699 18.6825 7.66699 18.7328 7.67004C19.3755 7.70897 19.9383 8.11459 20.1784 8.71199C20.1972 8.75878 20.2148 8.81152 20.25 8.91699C20.2852 9.02247 20.3027 9.07521 20.3216 9.12199C20.5617 9.71939 21.1245 10.125 21.7672 10.1639C21.8175 10.167 21.8767 10.167 21.9953 10.167C22.303 10.167 22.4569 10.167 22.5798 10.1792C23.7656 10.2967 24.7037 11.2347 24.8212 12.4205C24.8333 12.5434 24.8333 12.6894 24.8333 12.9813V19.5003C24.8333 20.9005 24.8333 21.6005 24.5608 22.1353C24.3212 22.6057 23.9387 22.9882 23.4683 23.2278C22.9335 23.5003 22.2335 23.5003 20.8333 23.5003H12.1667C10.7665 23.5003 10.0665 23.5003 9.53168 23.2278C9.06127 22.9882 8.67882 22.6057 8.43914 22.1353C8.16666 21.6005 8.16666 20.9005 8.16666 19.5003V12.9813Z"
            stroke="white"
            strokeWidth="1.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M16.5 19.7507C18.3409 19.7507 19.8333 18.2582 19.8333 16.4173C19.8333 14.5764 18.3409 13.084 16.5 13.084C14.659 13.084 13.1667 14.5764 13.1667 16.4173C13.1667 18.2582 14.659 19.7507 16.5 19.7507Z"
            stroke="white"
            strokeWidth="1.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <input type="file" className={"hidden"} />
      </label>
      <div className={"flex flex-col gap-[14px]"}>
        <div className={"flex flex-col gap-2"}>
          <span className={"text-body2_16_medium text-talearnt_Text_01"}>
            닉네임
          </span>
          <Input
            value={nickname}
            onChange={({ target: { value } }) =>
              setEditProfileData(prev => ({
                ...prev,
                nickname: value,
              }))
            }
          />
        </div>
        <div className={"flex flex-col gap-2"}>
          <span className={"text-body2_16_medium text-talearnt_Text_01"}>
            주고 싶은 재능
          </span>
          <DropdownSearchable<number>
            options={talentsOptions}
            onSelectHandler={({ checked, value }) => {
              if (checked && giveTalents.length >= 5) {
                setToast({
                  message: "키워드는 5개까지만 설정 가능해요",
                  type: "error",
                });
                return;
              }

              setEditProfileData(prev => ({
                ...prev,
                giveTalents: checked
                  ? [...prev.giveTalents, value]
                  : prev.giveTalents.filter(
                      selectedValue => selectedValue !== value
                    ),
              }));
            }}
            placeholder={"받고 싶은 재능을 선택해 주세요 (최대 5개 선택 가능)"}
            selectedValue={giveTalents}
          />
        </div>
        <div className={"flex flex-col gap-2"}>
          <span className={"text-body2_16_medium text-talearnt_Text_01"}>
            받고 싶은 재능
          </span>
          <DropdownSearchable<number>
            options={talentsOptions}
            onSelectHandler={({ checked, value }) => {
              if (checked && receiveTalents.length >= 5) {
                setToast({
                  message: "키워드는 5개까지만 설정 가능해요",
                  type: "error",
                });
                return;
              }

              setEditProfileData(prev => ({
                ...prev,
                receiveTalents: checked
                  ? [...prev.receiveTalents, value]
                  : prev.receiveTalents.filter(
                      selectedValue => selectedValue !== value
                    ),
              }));
            }}
            placeholder={"받고 싶은 재능을 선택해 주세요 (최대 5개 선택 가능)"}
            selectedValue={receiveTalents}
          />
        </div>
      </div>
      <div className={"grid grid-cols-[110px_110px] justify-end gap-4"}>
        <Button
          onClick={() => setIsEditProfile(false)}
          buttonStyle={"outlined-blue"}
        >
          취소하기
        </Button>
        <Button>수정하기</Button>
      </div>
    </>
  );
}

export { ProfileEditForm };
