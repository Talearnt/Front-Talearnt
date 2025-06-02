import { ComponentProps, useRef, useState } from "react";

import { classNames } from "@shared/utils/classNames";

import { useGetProfile } from "@features/user/user.hook";

import { useToastStore } from "@store/toast.store";
import { useAuthStore } from "@store/user.store";

import { Button } from "@components/common/Button/Button";
import { Textarea } from "@components/common/Textarea/Textarea";
import { Avatar } from "@components/shared/Avatar/Avatar";

type ReplyProps = ComponentProps<"textarea"> & {
  className?: string;
  content?: string;
  submitButtonText?: string;
  onCancelHandler?: () => void;
  onSubmitHandler: (content: string) => void | Promise<void>;
};

function UserContentWrite({
  className,
  content,
  submitButtonText = "등록",
  onCancelHandler,
  onSubmitHandler,
  ...props
}: ReplyProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const {
    data: {
      data: { profileImg },
    },
  } = useGetProfile();

  const setToast = useToastStore(state => state.setToast);
  const isLoggedIn = useAuthStore(state => state.isLoggedIn);

  const [editContent, setEditContent] = useState(content ?? "");
  const [isLoading, setIsLoading] = useState(false);

  const handleCancel = () => {
    if (!textareaRef.current) {
      return;
    }

    setEditContent("");
    textareaRef.current.blur();
  };

  return (
    <div className={classNames("flex gap-4", className)}>
      <Avatar imageUrl={profileImg} />
      <div className={"flex flex-1 flex-col gap-4"}>
        <Textarea
          ref={textareaRef}
          {...props}
          onMouseDown={e => {
            if (isLoggedIn) {
              return;
            }

            e.preventDefault();
            setToast({
              message: "로그인이 필요한 서비스입니다",
              type: "error",
            });
          }}
          onChange={({ target: { value } }) => setEditContent(value)}
          value={editContent}
        />
        <div className={"flex justify-end gap-4"}>
          <Button
            onClick={onCancelHandler ?? handleCancel}
            buttonStyle={"outlined"}
            size={"small"}
          >
            취소
          </Button>
          <Button
            onClick={async () => {
              setIsLoading(true);
              await onSubmitHandler(editContent);
              setEditContent("");
              setIsLoading(false);
            }}
            size={"small"}
            disabled={
              content === editContent || editContent.length < 3 || isLoading
            }
          >
            {submitButtonText}
          </Button>
        </div>
      </div>
    </div>
  );
}

export { UserContentWrite };
