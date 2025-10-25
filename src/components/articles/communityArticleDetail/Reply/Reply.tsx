import { useState } from "react";

import {
  useDeleteCommunityArticleReply,
  usePutEditCommunityArticleReply,
} from "@features/articles/communityArticleReply/communityArticleReply.hook";
import { useGetProfile } from "@features/user/profile/profile.hook";

import { usePromptStore } from "@store/prompt.store";

import { UserContentSection } from "@components/articles/communityArticleDetail/UserContentSection/UserContentSection";
import { UserContentWrite } from "@components/articles/communityArticleDetail/UserContentWrite/UserContentWrite";
import { Dot } from "@components/common/Dot/Dot";

import {
  commentType,
  replyType,
} from "@features/articles/shared/articles.type";

type ReplyProps = Pick<commentType, "commentNo"> & Omit<replyType, "userNo">;

function Reply({
  commentNo,
  replyNo,
  profileImg,
  nickname: authorNickname,
  content,
  createdAt,
  isDeleted,
  updatedAt,
}: ReplyProps) {
  const [isEdit, setIsEdit] = useState(false);

  const setPrompt = usePromptStore(state => state.setPrompt);

  const {
    data: {
      data: { nickname },
    },
  } = useGetProfile();
  const { mutateAsync: editCommunityArticleReply } =
    usePutEditCommunityArticleReply(commentNo, replyNo);
  const { mutate } = useDeleteCommunityArticleReply(commentNo, replyNo);

  return isEdit ? (
    <UserContentWrite
      content={content}
      onCancelHandler={() => setIsEdit(false)}
      onSubmitHandler={async content => {
        await editCommunityArticleReply(content);
        setIsEdit(false);
      }}
      submitButtonText={"수정"}
      maxLength={300}
    />
  ) : (
    <div className={"rounded-xl bg-talearnt_BG_Up_01 p-4"}>
      <UserContentSection
        profileImg={profileImg}
        authorNickname={authorNickname}
        createdAt={createdAt}
        updatedAt={updatedAt}
        content={content}
        deletedData={{
          isDeleted,
          deletedText: "작성자가 삭제한 답글입니다.",
        }}
      >
        {nickname === authorNickname && !isDeleted && (
          <div className={"flex items-center gap-2"}>
            <button
              className={"text-caption2_12_semibold text-talearnt_Text_03"}
              onClick={() => setIsEdit(true)}
            >
              수정하기
            </button>
            <Dot />
            <button
              className={"text-caption2_12_semibold text-talearnt_Text_03"}
              onClick={() =>
                setPrompt({
                  title: "답글 삭제",
                  content:
                    "정말 답글을 삭제하시겠어요? 삭제한 답글은 되돌릴 수 없어요.",
                  cancelText: "취소",
                  confirmText: "삭제",
                  confirmOnClickHandler: () => mutate(),
                })
              }
            >
              삭제하기
            </button>
          </div>
        )}
      </UserContentSection>
    </div>
  );
}

export { Reply };
