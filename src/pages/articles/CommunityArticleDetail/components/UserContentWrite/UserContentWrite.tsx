import { ComponentProps, useRef, useState } from "react";

import { classNames } from "@utils/classNames";

import { useGetProfile } from "@hook/user.hook";

import { Avatar } from "@components/Avatar/Avatar";
import { Button } from "@components/Button/Button";
import { Textarea } from "@components/Textarea/Textarea";

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
      data: { profileImg }
    }
  } = useGetProfile();

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
