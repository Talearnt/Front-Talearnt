import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import dayjs from "dayjs";

import { classNames } from "@utils/classNames";
import { filteredTalents } from "@utils/filteredTalents";

import { useGetProfile } from "@hook/user.hook";
import {
  useDeleteMatchingArticle,
  useGetMatchingArticleDetail
} from "@pages/articles/MatchingArticleDetail/core/matchingArticleDetail.hook";

import { usePromptStore, useToastStore } from "@common/common.store";
import { useEditMatchingArticleDataStore } from "@pages/articles/core/articles.store";

import { ImageCarousel } from "@modal/ImageCarousel/ImageCarousel";

import { AnimatedLoader } from "@components/AnimatedLoader/AnimatedLoader";
import { Avatar } from "@components/Avatar/Avatar";
import { Badge } from "@components/Badge/Badge";
import { PostFavoriteIcon } from "@components/icons/PostFavoriteIcon/PostFavoriteIcon";

function MatchingArticleDetail() {
  const navigator = useNavigate();

  const {
    data: {
      data: { userNo: profileUserNo }
    }
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
        count
      }
    },
    error,
    isError,
    isLoading
  } = useGetMatchingArticleDetail();
  const { mutate } = useDeleteMatchingArticle();

  const setEditMatchingArticle = useEditMatchingArticleDataStore(
    state => state.setEditMatchingArticle
  );
  const setToast = useToastStore(state => state.setToast);
  const setPrompt = usePromptStore(state => state.setPrompt);

  const [clickedIndex, setClickedIndex] = useState<number | undefined>(
    undefined
  );

  const handleDelete = () =>
    setPrompt({
      title: "게시물 삭제",
      content:
        "정말 게시물을 삭제하시겠어요? 삭제한 게시물은 되돌릴 수 없어요.",
      cancelOnClickHandler: () => setPrompt(),
      confirmOnClickHandler: () => mutate(exchangePostNo)
    });
  const handleEdit = () => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(content, "text/html");

    setEditMatchingArticle({
      exchangePostNo,
      title,
      content,
      pureText: doc.body.textContent ?? "",
      imageFileList: [],
      giveTalents: filteredTalents(giveTalents).map(
        ({ talentCode }) => talentCode
      ),
      receiveTalents: filteredTalents(receiveTalents).map(
        ({ talentCode }) => talentCode
      ),
      duration,
      exchangeType
    });

    navigator("/write-article");
  };

  useEffect(() => {
    if (isError) {
      if (error?.errorMessage) {
        setToast({ message: error.errorMessage, type: "error" });
      }

      navigator("/matching");
    }
  }, [error, isError, navigator, setToast]);

  return (
    <div className={classNames("flex flex-col gap-6", "h-full w-[848px] pt-8")}>
      {isLoading ? (
        <AnimatedLoader />
      ) : (
        <>
          {userNo === profileUserNo && (
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
            </span>
            <Badge
              label={status}
              size={"medium"}
              type={status === "모집중" ? "primary" : "disabled"}
            />
            <div
              className={classNames(
                "ml-auto rounded-lg border border-talearnt_Line_01 p-2",
                "cursor-pointer",
                "hover:bg-talearnt_BG_Up_01"
              )}
            >
              <PostFavoriteIcon isFavorite={isFavorite} size={32} />
            </div>
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
                    type={"keyword"}
                    size={"medium"}
                    key={`preview-giveTalent-${talentName}`}
                  />
                ))}
              </div>
            </div>
            <div className={"flex flex-col gap-2"}>
              <label className={"text-body2_16_semibold text-talearnt_Text_03"}>
                주고 싶은 나의 재능
              </label>
              <div className={"flex flex-wrap gap-2"}>
                {receiveTalents.map(talentName => (
                  <Badge
                    label={talentName}
                    type={"keyword"}
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
