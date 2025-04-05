import { useState } from "react";

import { useGetProfile } from "@hook/user.hook";

import { UserContentSection } from "@pages/articles/CommunityArticleDetail/components/UserContentSection/UserContentSection";
import { UserContentWrite } from "@pages/articles/CommunityArticleDetail/components/UserContentWrite/UserContentWrite";

import { Dot } from "@components/Dot/Dot";

import { replyType } from "@pages/articles/core/articles.type";

type ReplyProps = Pick<
  replyType,
  "profileImg" | "nickname" | "content" | "createdAt"
>;

function Reply({
  profileImg,
  nickname: authorNickname,
  content,
  createdAt
}: ReplyProps) {
  const {
    data: {
      data: { nickname }
    }
  } = useGetProfile();

  const [isEdit, setIsEdit] = useState(false);

  return isEdit ? (
    // TODO 답글 수정 API 적용
    <UserContentWrite
      content={content}
      onCancelHandler={() => setIsEdit(false)}
      onSubmitHandler={console.log}
      submitButtonText={"수정"}
      maxLength={300}
    />
  ) : (
    <div className={"rounded-xl bg-talearnt_BG_Up_01 p-4"}>
      <UserContentSection
        profileImg={profileImg}
        authorNickname={authorNickname}
        createdAt={createdAt}
        content={content}
      >
        {nickname === authorNickname && (
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
