import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import dayjs from "dayjs";
import { useShallow } from "zustand/shallow";

import { classNames } from "@utils/classNames";

import { useGetProfile } from "@hook/user.hook";
import {
  useDeleteCommunityArticle,
  useGetCommunityArticleCommentList,
  useGetCommunityArticleDetail,
  usePostCommunityArticleComment
} from "@pages/articles/CommunityArticleDetail/core/communityArticleDetail.hook";

import { usePromptStore, useToastStore } from "@common/common.store";
import { useCommunityArticleCommentPageStore } from "@pages/articles/CommunityArticleDetail/core/communityArticleDetail.store";
import { useEditCommunityArticleDataStore } from "@pages/articles/core/articles.store";

import { Comment } from "@pages/articles/CommunityArticleDetail/components/Comment/Comment";
import { UserContentWrite } from "@pages/articles/CommunityArticleDetail/components/UserContentWrite/UserContentWrite";

import { ImageCarousel } from "@modal/ImageCarousel/ImageCarousel";

import { AnimatedLoader } from "@components/AnimatedLoader/AnimatedLoader";
import { Avatar } from "@components/Avatar/Avatar";
import { Badge } from "@components/Badge/Badge";
import { ThumbsUpIcon } from "@components/icons/ThumbsUpIcon/ThumbsUpIcon";
import { Pagination } from "@components/Pagination/Pagination";

function CommunityArticleDetail() {
  const navigator = useNavigate();

  const {
    data: {
      data: { userNo: profileUserNo }
    }
  } = useGetProfile();
  const {
    data: {
      data: {
        commentLastPage,
        communityPostNo,
        content,
        count,
        createdAt,
        imageUrls,
        isLike,
        likeCount,
        nickname,
        postType,
        profileImg,
        title,
        userNo
      }
    },
    error,
    isError,
    isLoading,
    isSuccess
  } = useGetCommunityArticleDetail();
  const {
    data: {
      data: {
        results: commentList,
        pagination: { totalCount, totalPages }
      }
    },
    isLoading: commentIsLoading
  } = useGetCommunityArticleCommentList();
  const { mutate: deleteCommunityArticle } = useDeleteCommunityArticle();
  const { mutate: postCommunityArticleComment } =
    usePostCommunityArticleComment();

  const { page, setPage } = useCommunityArticleCommentPageStore(
    useShallow(state => ({
      page: state.page,
      setPage: state.setPage
    }))
  );
  const setEditCommunityArticle = useEditCommunityArticleDataStore(
    state => state.setEditCommunityArticle
  );
  const setToast = useToastStore(state => state.setToast);
  const setPrompt = usePromptStore(state => state.setPrompt);

  const [clickedIndex, setClickedIndex] = useState<number | undefined>(
    undefined
  );

  const handleEdit = () => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(content, "text/html");

    setEditCommunityArticle({
      communityPostNo,
      title,
      content,
      pureText: doc.body.textContent ?? "",
      imageFileList: [],
      postType
    });

    navigator("/write-article/community");
  };
  const handleDelete = () =>
    setPrompt({
      title: "게시물 삭제",
      content:
        "정말 게시물을 삭제하시겠어요? 삭제한 게시물은 되돌릴 수 없어요.",
      cancelOnClickHandler: () => setPrompt(),
      confirmOnClickHandler: () => deleteCommunityArticle(communityPostNo)
    });

  useEffect(() => {
    // 상세 정보 API 에러난 경우 목록으로 리턴
    if (isError) {
      if (error?.errorMessage) {
        setToast({ message: error.errorMessage, type: "error" });
      }

      navigator("/community");
    }
  }, [error, isError, navigator, setToast]);
  // 댓글 마지막 페이지 저장, 페이지 이탈 시 초기화
  useEffect(() => {
    if (!isSuccess) {
      return;
    }

    setPage(commentLastPage);

    return () => setPage(0);
  }, [commentLastPage, isSuccess, setPage]);

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
            <Badge label={postType} size={"medium"} />
            <div
              className={classNames(
                "ml-auto rounded-lg border border-talearnt_Line_01 p-2",
                "cursor-pointer",
                "hover:bg-talearnt_BG_Up_01"
              )}
            >
              <ThumbsUpIcon isPressed={isLike} />
            </div>
          </div>
          {/*TODO 매칭/커뮤니티 상세, 게시물 작성 미리보기 컴포넌트 통합*/}
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
          <p
            className={"mb-8 border-t border-talearnt_Line_01 pt-6"}
            dangerouslySetInnerHTML={{ __html: content }}
          />
          <div
            className={classNames(
              "flex items-center gap-2",
              "mb-8 border-b border-talearnt_Line_01 pb-3"
            )}
          >
            <span className={"text-body3_14_medium text-talearnt_Text_03"}>
              추천수 {likeCount}
            </span>
            <div className={"h-1 w-1 rounded-full bg-talearnt_Text_03"} />
            <span className={"text-body3_14_medium text-talearnt_Text_03"}>
              조회수 {count}
            </span>
          </div>
          <div className={"flex flex-col gap-6"}>
            <p
              className={"text-heading4_20_semibold text-talearnt_Text_Strong"}
            >
              댓글
              <span className={classNames("ml-1", "text-talearnt_Primary_01")}>
                {commentIsLoading ? "-" : totalCount}
              </span>
            </p>
            <UserContentWrite
              onSubmitHandler={postCommunityArticleComment}
              maxLength={300}
              placeholder={"댓글을 남겨보세요! (3글자 이상 입력)"}
            />
            {commentList.map(comment => (
              <Comment {...comment} key={comment.commentNo} />
            ))}
            <Pagination
              className={"mt-8"}
              currentPage={page}
              totalPages={totalPages}
              handlePageChange={setPage}
            />
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

export default CommunityArticleDetail;
