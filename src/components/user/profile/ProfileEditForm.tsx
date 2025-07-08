import {
  ChangeEvent,
  Dispatch,
  SetStateAction,
  useEffect,
  useState,
} from "react";

import { compressImageFile } from "@features/articles/shared/writeArticle.util";
import { classNames } from "@shared/utils/classNames";

import { useCheckNickname } from "@features/auth/signUp/signUp.hook";
import { usePutProfile } from "@features/user/profile/profile.hook";
import { useDebounce } from "@shared/hooks/useDebounce";

import { usePromptStore } from "@store/prompt.store";
import { useToastStore } from "@store/toast.store";

import { Button } from "@components/common/Button/Button";
import { DropdownSearchable } from "@components/common/dropdowns/DropdownSearchable/DropdownSearchable";
import { Input } from "@components/common/inputs/Input/Input";
import { LabelText } from "@components/common/LabelText/LabelText";
import { Spinner } from "@components/common/Spinner/Spinner";
import { Avatar } from "@components/shared/Avatar/Avatar";

import { talentsOptions } from "@shared/constants/talentsOptions";

import { profileType } from "@features/user/profile/profile.type";

type profileFormDataType = Omit<profileType, "userId" | "userNo">;
type ProfileEditFormProps = {
  originalProfileData: profileFormDataType;
  editProfileData: profileFormDataType;
  setEditProfileData: Dispatch<SetStateAction<profileFormDataType>>;
  setIsEditProfile: Dispatch<SetStateAction<boolean>>;
};

function ProfileEditForm({
  originalProfileData: {
    profileImg: originalProfileImg,
    nickname: originalNickname,
    giveTalents: originalGiveTalents,
    receiveTalents: originalReceiveTalents,
  },
  editProfileData: { profileImg, nickname, giveTalents, receiveTalents },
  setEditProfileData,
  setIsEditProfile,
}: ProfileEditFormProps) {
  const [imageFile, setImageFile] = useState<File | null>(null);

  const setToast = useToastStore(state => state.setToast);
  const setPrompt = usePromptStore(state => state.setPrompt);

  const { mutateAsync } = usePutProfile();
  const debounceNickname = useDebounce(nickname, {
    returnUndefinedBeforeDebounce: true,
  });
  const { data, error, isLoading, isError } = useCheckNickname(
    debounceNickname,
    !!debounceNickname &&
      debounceNickname !== originalNickname &&
      debounceNickname === nickname
  );

  const isProfileUnchanged =
    originalProfileImg === profileImg &&
    originalNickname === nickname &&
    originalGiveTalents.every(talent => giveTalents.includes(talent)) &&
    originalGiveTalents.length === giveTalents.length &&
    originalReceiveTalents.every(talent => receiveTalents.includes(talent)) &&
    originalReceiveTalents.length === receiveTalents.length;
  const isNicknameEmpty = nickname.length === 0;
  const isNicknameValid = data?.data || isError || isNicknameEmpty;

  const handleImageChange = async ({
    target: { files },
  }: ChangeEvent<HTMLInputElement>) => {
    if (!files || files.length === 0) {
      return;
    }

    const { file, url } = await compressImageFile(files[0]);

    setImageFile(file);
    setEditProfileData(prev => ({
      ...prev,
      profileImg: url,
    }));
  };
  const handleNicknameChange = ({
    target: { value },
  }: ChangeEvent<HTMLInputElement>) => {
    setEditProfileData(prev => ({
      ...prev,
      nickname: value,
    }));
  };
  const handleDropdownSelect =
    (type: "giveTalents" | "receiveTalents") =>
    ({ checked, value }: { checked: boolean; value: number }) => {
      if (
        checked &&
        (type === "giveTalents" ? giveTalents : receiveTalents).length >= 5
      ) {
        setToast({
          message: "키워드는 5개까지만 설정 가능해요",
          type: "error",
        });
        return;
      }

      setEditProfileData(prev => ({
        ...prev,
        [type]: checked
          ? [...prev[type], value]
          : prev[type].filter(selectedValue => selectedValue !== value),
      }));
    };
  const handleCancelEdit = () => {
    if (isProfileUnchanged) {
      setIsEditProfile(false);
      return;
    }

    setPrompt({
      title: "수정 취소",
      content: "정말 취소하시겠어요? 취소하면 변경한 내용이 모두 사라져요.",
      confirmOnClickHandler: () => setIsEditProfile(false),
      cancelOnClickHandler: () => setPrompt(),
    });
  };
  const handleEditProfile = async () => {
    await mutateAsync({
      file: imageFile,
      profileImg,
      nickname,
      giveTalents,
      receiveTalents,
    });

    setIsEditProfile(false);
  };

  useEffect(() => {
    return () => {
      setEditProfileData({
        nickname: "",
        profileImg: "",
        giveTalents: [],
        receiveTalents: [],
      });
      setImageFile(null);
    };
  }, [setEditProfileData]);

  return (
    <>
      <div className={"flex flex-col gap-1"}>
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
          <input
            className={"hidden"}
            onChange={handleImageChange}
            accept="image/jpeg, image/png, image/jfif, image/tiff, image/webp"
            type="file"
          />
        </label>
        {profileImg && (
          <button
            className={classNames(
              "px-3 py-[11px]",
              "text-body3_14_medium text-talearnt_Text_02"
            )}
            onClick={() =>
              setEditProfileData(prev => ({
                ...prev,
                profileImg: null,
              }))
            }
          >
            이미지 삭제
          </button>
        )}
      </div>
      <div className={"flex flex-col gap-[14px]"}>
        <div className={"flex flex-col"}>
          <span
            className={classNames(
              "mb-2",
              "text-body2_16_medium text-talearnt_Text_01"
            )}
          >
            닉네임
          </span>
          <Input
            value={nickname}
            onChange={handleNicknameChange}
            error={
              data?.data === true
                ? "이미 등록된 닉네임입니다"
                : isNicknameEmpty
                  ? "닉네임을 입력해 주세요"
                  : (error?.errorMessage ?? undefined)
            }
            insideNode={
              isLoading ? (
                <Spinner />
              ) : isNicknameValid ? (
                <LabelText type={"error"}>사용불가</LabelText>
              ) : data?.data === false ? (
                <LabelText>사용가능</LabelText>
              ) : undefined
            }
          />
          {!isNicknameValid && (
            <>
              <p
                className={classNames(
                  "mt-1",
                  "text-caption1_14_medium text-talearnt_Text_03"
                )}
              >
                * 2~12자 이내로 입력해 주세요
              </p>
              <p className={"text-caption1_14_medium text-talearnt_Primary_01"}>
                * 한글, 영문, 숫자는 자유롭게 입력 가능하며, 특수문자는 #만 입력
                가능해요
              </p>
            </>
          )}
        </div>
        <div className={"flex flex-col gap-2"}>
          <span className={"text-body2_16_medium text-talearnt_Text_01"}>
            주고 싶은 재능
          </span>
          <DropdownSearchable<number>
            options={talentsOptions}
            onSelectHandler={handleDropdownSelect("giveTalents")}
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
            onSelectHandler={handleDropdownSelect("receiveTalents")}
            placeholder={"받고 싶은 재능을 선택해 주세요 (최대 5개 선택 가능)"}
            selectedValue={receiveTalents}
          />
        </div>
      </div>
      <div className={"grid grid-cols-[110px_110px] justify-end gap-4"}>
        <Button onClick={handleCancelEdit} buttonStyle={"outlined-blue"}>
          취소하기
        </Button>
        <Button
          onClick={handleEditProfile}
          disabled={
            isProfileUnchanged ||
            isNicknameValid ||
            giveTalents.length === 0 ||
            receiveTalents.length === 0
          }
        >
          수정하기
        </Button>
      </div>
    </>
  );
}

export { ProfileEditForm };
