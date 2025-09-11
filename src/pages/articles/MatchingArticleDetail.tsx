import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import dayjs from "dayjs";

import { classNames } from "@shared/utils/classNames";
import { findTalentList } from "@shared/utils/findTalent";

import {
  useDeleteMatchingArticle,
  useGetMatchingArticleDetail,
  usePostChangeMatchingArticleStatus,
} from "@features/articles/matchingArticleDetail/matchingArticleDetail.hook";
import { usePostMatchingArticleFavorite } from "@features/articles/matchingArticleFavorite/matchingArticleFavorite.hook";
import { useGetProfile } from "@features/user/profile/profile.hook";

import { useEditMatchingArticleDataStore } from "@features/articles/shared/articles.store";
import { usePromptStore } from "@store/prompt.store";
import { useToastStore } from "@store/toast.store";
import { useAuthStore } from "@store/user.store";

import { ImageCarousel } from "@components/common/modal/ImageCarousel/ImageCarousel";

import { AnimatedLoader } from "@components/common/AnimatedLoader/AnimatedLoader";
import { Badge } from "@components/common/Badge/Badge";
import { HeartIcon } from "@components/common/icons/styled/HeartIcon";
import { TabSlider } from "@components/common/TabSlider/TabSlider";
import { Avatar } from "@components/shared/Avatar/Avatar";

import { matchingArticleType } from "@features/articles/matchingArticleList/matchingArticleList.type";

/**
 * MatchingArticleDetail
 * - 매칭 게시물 상세 정보를 표시하고, 수정/삭제를 수행합니다.
 * - 상세 조회, 삭제 확인 프롬프트, 이미지 확대 캐러셀을 포함합니다.
 */
function MatchingArticleDetail() {
  const navigator = useNavigate();

  const [clickedIndex, setClickedIndex] = useState<number | undefined>(
    undefined
  );

  const isLoggedIn = useAuthStore(state => state.isLoggedIn);
  const setEditMatchingArticle = useEditMatchingArticleDataStore(
    state => state.setEditMatchingArticle
  );
  const setToast = useToastStore(state => state.setToast);
  const setPrompt = usePromptStore(state => state.setPrompt);

  const {
    data: {
      data: { userNo: profileUserNo },
    },
  } = useGetProfile();
  const {
    data: {
      data: {
        exchangePostNo,
        userNo,
        nickname,
        profileImg,
        title,
        content,
        duration,
        exchangeType,
        giveTalents,
        receiveTalents,
        status,
        createdAt,
        favoriteCount,
        isFavorite,
        imageUrls,
        count,
        updatedAt,
      },
    },
    error,
    isError,
    isLoading,
  } = useGetMatchingArticleDetail();
  const { mutate: mutateDeleteArticle } = useDeleteMatchingArticle();
  const { mutate: mutateFavorite } = usePostMatchingArticleFavorite();
  const { mutate: mutateChangeStatus } = usePostChangeMatchingArticleStatus();

  const isMyArticle = userNo === profileUserNo;

  const handleEdit = () => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(content, "text/html");

    setEditMatchingArticle({
      exchangePostNo,
      title,
      content,
      pureText: doc.body.textContent ?? "",
      imageFileList: [],
      giveTalents: findTalentList(giveTalents).map(
        ({ talentCode }) => talentCode
      ),
      receiveTalents: findTalentList(receiveTalents).map(
        ({ talentCode }) => talentCode
      ),
      duration,
      exchangeType,
    });

    navigator("/write-article/matching");
  };
  const handleDelete = () =>
    setPrompt({
      title: "게시물 삭제",
      content:
        "정말 게시물을 삭제하시겠어요? 삭제한 게시물은 되돌릴 수 없어요.",
      confirmOnClickHandler: mutateDeleteArticle,
    });

  useEffect(() => {
    if (isError) {
      if (error?.errorMessage) {
        setToast({ message: error.errorMessage, type: "error" });
      }

      navigator("/matching");
    }
  }, [error, isError, navigator, setToast]);

  return (
    <div className={classNames("flex flex-col gap-6", "h-full w-[848px]")}>
      {isLoading ? (
        <AnimatedLoader />
      ) : (
        <>
          {isMyArticle && (
            <div className={"flex justify-end gap-4"}>
              <button
                className={classNames(
                  "h-10 w-[60px] rounded-md bg-talearnt_BG_Background",
                  "text-body1_18_medium text-talearnt_Text_03",
                  "hover:bg-talearnt_BG_Up_01 hover:text-talearnt_Text_02"
                )}
                onClick={handleEdit}
              >
                수정
              </button>
              <button
                className={classNames(
                  "h-10 w-[60px] rounded-md bg-talearnt_BG_Background",
                  "text-body1_18_medium text-talearnt_Text_03",
                  "hover:bg-talearnt_BG_Up_01 hover:text-talearnt_Text_02"
                )}
                onClick={handleDelete}
              >
                삭제
              </button>
            </div>
          )}
          <h1 className={"text-heading1_30_semibold text-talearnt_Text_Strong"}>
            {title}
          </h1>
          <div className={"flex items-center gap-4"}>
            <Avatar imageUrl={profileImg} />
            <span className={"text-body1_18_semibold text-talearnt_Text_01"}>
              {nickname}
            </span>
            <div className={"h-5 w-px bg-talearnt_Line_01"} />
            <span className={"text-body1_18_semibold text-talearnt_Text_04"}>
              {dayjs(createdAt).format("YYYY-MM-DD")}
              {updatedAt && ` (${dayjs(updatedAt).format("YYYY-MM-DD")} 수정)`}
            </span>
            {isMyArticle ? (
              <TabSlider<matchingArticleType["status"]>
                currentValue={status}
                onClickHandler={status =>
                  setPrompt({
                    title: `${status}으로 변경`,
                    content: `${status}으로 변경할까요?\n변경하면 새로운 신청을 받을 수 ${status === "모집중" ? "있어요" : "없어요"}.`,
                    confirmOnClickHandler: () => mutateChangeStatus({ status }),
                  })
                }
                options={[
                  {
                    label: "모집중",
                    value: "모집중",
                  },
                  {
                    label: "모집 완료",
                    value: "모집 완료",
                  },
                ]}
                type={"shadow-small"}
              />
            ) : (
              <Badge
                label={status}
                color={status === "모집중" ? "skyblue" : "lightgray"}
                size={"medium"}
              />
            )}
            <button
              className={classNames(
                "ml-auto rounded-lg border border-talearnt_Line_01 p-2",
                "cursor-pointer",
                "hover:bg-talearnt_BG_Up_01"
              )}
              onClick={() =>
                isLoggedIn
                  ? mutateFavorite(exchangePostNo)
                  : navigator("/sign-in")
              }
            >
              <HeartIcon
                iconType={isFavorite ? "filled-blue" : "outlined"}
                size={32}
              />
            </button>
          </div>
          <div className={"grid grid-cols-2 gap-6"}>
            <div className={"flex flex-col gap-2"}>
              <label className={"text-body2_16_semibold text-talearnt_Text_03"}>
                주고 싶은 나의 재능
              </label>
              <div className={"flex flex-wrap gap-2"}>
                {giveTalents.map(talentName => (
                  <Badge
                    label={talentName}
                    color={"darkgray"}
                    rounded={"md"}
                    size={"medium"}
                    key={`preview-giveTalent-${talentName}`}
                  />
                ))}
              </div>
            </div>
            <div className={"flex flex-col gap-2"}>
              <label className={"text-body2_16_semibold text-talearnt_Text_03"}>
                받고 싶은 나의 재능
              </label>
              <div className={"flex flex-wrap gap-2"}>
                {receiveTalents.map(talentName => (
                  <Badge
                    label={talentName}
                    color={"darkgray"}
                    rounded={"md"}
                    size={"medium"}
                    key={`preview-receiveTalent-${talentName}`}
                  />
                ))}
              </div>
            </div>
          </div>
          <div className={"flex gap-16"}>
            <div className={"flex gap-4"}>
              <label className={"text-body2_16_semibold text-talearnt_Text_03"}>
                진행 방식
              </label>
              <span className={"text-body2_16_semibold text-talearnt_Text_02"}>
                {exchangeType}
              </span>
            </div>
            <div className={"flex gap-4"}>
              <label className={"text-body2_16_semibold text-talearnt_Text_03"}>
                진행 기간
              </label>
              <span className={"text-body2_16_semibold text-talearnt_Text_02"}>
                {duration}
              </span>
            </div>
          </div>
          {imageUrls.length > 0 && (
            <div
              className={classNames(
                "flex gap-4",
                "rounded-2xl bg-talearnt_BG_Up_02 p-6"
              )}
            >
              {imageUrls.map((url, index) => {
                if (index > 3) {
                  return null;
                }

                return (
                  <div
                    className={classNames(
                      "relative",
                      "h-[188px] w-[188px] cursor-pointer overflow-hidden rounded-2xl"
                    )}
                    onClick={() => setClickedIndex(index === 3 ? 0 : index)}
                    key={url}
                  >
                    <img
                      className={"h-full w-full object-cover"}
                      src={url}
                      alt={`${index}번째 업로드 이미지`}
                    />
                    {imageUrls.length > 4 && index === 3 && (
                      <div
                        className={classNames(
                          "absolute top-0",
                          "flex items-center justify-center",
                          "h-full w-full bg-black/60"
                        )}
                      >
                        <span
                          className={
                            "text-body2_16_semibold text-talearnt_BG_Background"
                          }
                        >
                          이미지
                          <br />
                          더보기
                        </span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
          <div className={"h-px w-full bg-talearnt_Line_01"} />
          <p className={"mb-8"} dangerouslySetInnerHTML={{ __html: content }} />
          <div className={"flex items-center gap-2"}>
            <span className={"text-body3_14_medium text-talearnt_Text_03"}>
              찜 {favoriteCount}
            </span>
            <div className={"h-1 w-1 rounded-full bg-talearnt_Text_03"} />
            <span className={"text-body3_14_medium text-talearnt_Text_03"}>
              조회수 {count}
            </span>
          </div>
          {clickedIndex !== undefined && (
            <ImageCarousel
              title={title}
              clickedIndex={clickedIndex}
              imageUrls={imageUrls}
              onCloseHandler={() => setClickedIndex(undefined)}
            />
          )}
        </>
      )}
    </div>
  );
}

export default MatchingArticleDetail;
