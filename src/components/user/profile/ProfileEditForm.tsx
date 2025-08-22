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
import { CameraIcon } from "@components/common/icons/CameraIcon/CameraIcon";
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
          <CameraIcon className={"absolute bottom-0 right-0"} />
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
