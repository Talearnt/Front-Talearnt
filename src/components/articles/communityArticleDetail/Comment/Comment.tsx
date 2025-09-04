import { ComponentProps, useState } from "react";

import { classNames } from "@shared/utils/classNames";

import {
  useDeleteCommunityArticleComment,
  usePutEditCommunityArticleComment,
} from "@features/articles/communityArticleComment/communityArticleComment.hook";
import {
  useGetCommunityArticleReplyList,
  usePostCommunityArticleReply,
} from "@features/articles/communityArticleReply/communityArticleReply.hook";
import { useGetProfile } from "@features/user/profile/profile.hook";

import { useAuthStore } from "@store/user.store";

import { Reply } from "@components/articles/communityArticleDetail/Reply/Reply";
import { UserContentSection } from "@components/articles/communityArticleDetail/UserContentSection/UserContentSection";
import { UserContentWrite } from "@components/articles/communityArticleDetail/UserContentWrite/UserContentWrite";
import { Dot } from "@components/common/Dot/Dot";
import { CaretIcon } from "@components/common/icons/caret/CaretIcon";
import { ChatIcon } from "@components/common/icons/styled/ChatIcon";

import { commentType } from "@features/articles/shared/articles.type";

type CommentProps = Omit<commentType, "updatedAt" | "userNo">;

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
  content,
  commentNo,
  createdAt,
  isDeleted,
  nickname: commentAuthorNickname,
  profileImg,
  replyCount,
}: CommentProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isReplyWriting, setIsReplyWriting] = useState(false);
  const [isEdit, setIsEdit] = useState(false);

  const isLoggedIn = useAuthStore(state => state.isLoggedIn);

  const {
    data: {
      data: { nickname },
    },
  } = useGetProfile();
  const {
    data: replyList,
    fetchPreviousPage,
    hasPreviousPage,
  } = useGetCommunityArticleReplyList(commentNo, isOpen);
  const { mutateAsync: postCommunityArticleReply } =
    usePostCommunityArticleReply(commentNo, isOpen);
  const { mutateAsync: editCommunityArticleComment } =
    usePutEditCommunityArticleComment();
  const { mutate: deleteCommunityArticleComment } =
    useDeleteCommunityArticleComment();

  return isEdit ? (
    <UserContentWrite
      content={content}
      onCancelHandler={() => setIsEdit(false)}
      onSubmitHandler={async content => {
        await editCommunityArticleComment({ commentNo, content });
        setIsEdit(false);
      }}
      submitButtonText={"수정"}
      maxLength={300}
      placeholder={"댓글을 남겨보세요! (3글자 이상 입력)"}
    />
  ) : (
    <UserContentSection
      profileImg={profileImg}
      authorNickname={commentAuthorNickname}
      createdAt={createdAt}
      content={content}
      deletedData={{
        isDeleted,
      }}
    >
      {!isDeleted && (
        <>
          <div className={"flex gap-4"}>
            {isLoggedIn && (
              <ActionButton
                onClick={() => setIsReplyWriting(true)}
                withDot={false}
              >
                <ChatIcon size={20} />
                답글달기
              </ActionButton>
            )}
            {nickname === commentAuthorNickname && (
              <>
                <ActionButton onClick={() => setIsEdit(true)}>
                  수정하기
                </ActionButton>
                <ActionButton
                  onClick={() => deleteCommunityArticleComment(commentNo)}
                >
                  삭제하기
                </ActionButton>
              </>
            )}
          </div>
          {isReplyWriting && (
            <UserContentWrite
              className={"mt-2"}
              onCancelHandler={() => setIsReplyWriting(false)}
              onSubmitHandler={async content => {
                await postCommunityArticleReply(content);

                if (!isOpen) {
                  setIsOpen(true);
                }
              }}
              maxLength={300}
            />
          )}
        </>
      )}
      {replyCount > 0 && (
        <div
          className={classNames(
            "flex flex-col gap-4",
            "mt-2",
            isDeleted && "ml-[66px]"
          )}
        >
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
              {hasPreviousPage && (
                <button
                  className={classNames(
                    "w-fit rounded-full border border-talearnt_Icon_03 px-[11px] py-2",
                    "text-body3_14_medium text-talearnt_Text_02",
                    "hover:text-talearnt_Primary_01"
                  )}
                  onClick={() => fetchPreviousPage()}
                >
                  답글 더보기
                </button>
              )}
              {replyList?.map(reply => (
                <Reply commentNo={commentNo} {...reply} key={reply.replyNo} />
              ))}
            </div>
          )}
        </div>
      )}
    </UserContentSection>
  );
}

export { Comment };
