import { ComponentProps, useState } from "react";

import { classNames } from "@utils/classNames";

import { useGetProfile } from "@hook/user.hook";
import { useGetCommunityArticleReplyList } from "@pages/articles/CommunityArticleDetail/core/communityArticleDetail.hook";

import { useAuthStore } from "@pages/auth/core/auth.store";

import { Reply } from "@pages/articles/CommunityArticleDetail/components/Reply/Reply";
import { UserContentSection } from "@pages/articles/CommunityArticleDetail/components/UserContentSection/UserContentSection";
import { UserContentWrite } from "@pages/articles/CommunityArticleDetail/components/UserContentWrite/UserContentWrite";

import { Dot } from "@components/Dot/Dot";
import { CaretIcon } from "@components/icons/caret/CaretIcon/CaretIcon";
import { MessageIcon } from "@components/icons/MessageIcon/MessageIcon";

import { commentType } from "@pages/articles/core/articles.type";

type CommentProps = Pick<
  commentType,
  | "profileImg"
  | "createdAt"
  | "content"
  | "nickname"
  | "replyCount"
  | "commentNo"
>;

const ActionButton = ({
  children,
  withDot = true,
  ...props
}: ComponentProps<"button"> & { withDot?: boolean }) => (
  <button
    className={classNames(
      "flex items-center gap-1",
      "text-caption2_12_semibold text-talearnt_Text_03"
    )}
    {...props}
  >
    {withDot && <Dot />}
    {children}
  </button>
);

function Comment({
  profileImg,
  createdAt,
  commentNo,
  replyCount,
  nickname: commentAuthorNickname,
  content
}: CommentProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isReplyWriting, setIsReplyWriting] = useState(false);
  const [isEdit, setIsEdit] = useState(false);

  const {
    data: {
      data: { nickname }
    }
  } = useGetProfile();
  const {
    data: replyList,
    fetchNextPage,
    hasNextPage
  } = useGetCommunityArticleReplyList(commentNo, isOpen);

  const isLoggedIn = useAuthStore(state => state.isLoggedIn);

  return isEdit ? (
    // TODO 댓글 수정 API 적용
    <UserContentWrite
      content={content}
      onCancelHandler={() => setIsEdit(false)}
      onSubmitHandler={console.log}
      submitButtonText={"수정"}
      maxLength={300}
    />
  ) : (
    <UserContentSection
      profileImg={profileImg}
      authorNickname={commentAuthorNickname}
      createdAt={createdAt}
      content={content}
    >
      <div className={"flex gap-4"}>
        {isLoggedIn && (
          <ActionButton onClick={() => setIsReplyWriting(true)} withDot={false}>
            <MessageIcon size={20} />
            답글달기
          </ActionButton>
        )}
        {nickname === commentAuthorNickname && (
          <>
            <ActionButton onClick={() => setIsEdit(true)}>
              수정하기
            </ActionButton>
            {/*TODO 댓글 삭제 API 적용*/}
            <ActionButton>삭제하기</ActionButton>
          </>
        )}
      </div>
      {isReplyWriting && (
        //TODO 답글 달기 API 적용
        <UserContentWrite
          className={"mt-2"}
          onCancelHandler={() => setIsReplyWriting(false)}
          onSubmitHandler={console.log}
          maxLength={300}
        />
      )}
      {replyCount > 0 && (
        <div className={classNames("flex flex-col gap-4", "mt-2")}>
          <button
            className={classNames(
              "group/button",
              "flex items-center gap-1",
              "w-fit rounded-full border border-talearnt_Icon_03 py-[5px] pl-[11px] pr-[7px]",
              isOpen && "border-talearnt_Primary_01"
            )}
            onClick={() => setIsOpen(prev => !prev)}
          >
            <span
              className={classNames(
                "text-body3_14_medium text-talearnt_Text_02",
                "group-hover/button:text-talearnt_Primary_01",
                isOpen && "text-talearnt_Primary_01"
              )}
            >
              답글 {replyCount.toLocaleString()}개
            </span>
            <CaretIcon
              className={classNames(
                isOpen && "-rotate-90 stroke-talearnt_Icon_01"
              )}
              direction={"bottom"}
            />
          </button>
          {isOpen && (
            <div className={"flex flex-col gap-4"}>
              {replyList?.map(
                ({
                  profileImg,
                  nickname: replyAuthorNickname,
                  createdAt,
                  content,
                  replyNo
                }) => (
                  <Reply
                    profileImg={profileImg}
                    nickname={replyAuthorNickname}
                    content={content}
                    createdAt={createdAt}
                    key={replyNo}
                  />
                )
              )}
              {hasNextPage && (
                <button
                  className={classNames(
                    "w-fit rounded-full border border-talearnt_Icon_03 px-[11px] py-2",
                    "text-body3_14_medium text-talearnt_Text_02",
                    "hover:text-talearnt_Primary_01"
                  )}
                  onClick={() => fetchNextPage()}
                >
                  더보기
                </button>
              )}
            </div>
          )}
        </div>
      )}
    </UserContentSection>
  );
}

export { Comment };
