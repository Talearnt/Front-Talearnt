import { useRef } from "react";

import dayjs from "dayjs";

import { classNames } from "@utils/classNames";
import { filteredTalents } from "@utils/filteredTalents";

import { useGetProfile } from "@hook/user.hook";

import { Avatar } from "@components/Avatar/Avatar";
import { Badge } from "@components/Badge/Badge";
import { Button } from "@components/Button/Button";
import { ModalBody } from "@components/modal/ModalBody/ModalBody";
import { ModalBottom } from "@components/modal/ModalBottom/ModalBottom";
import { ModalBox } from "@components/modal/ModalBox/ModalBox";
import { ModalContainer } from "@components/modal/ModalContainer/ModalContainer";
import { ModalHeader } from "@components/modal/ModalHeader/ModalHeader";

import { postType } from "@pages/articles/core/articles.type";

type communityArticlePreviewProps = {
  type: "community";
  postType: postType;
};
type matchingArticlePreviewProps = {
  type: "matching";
  duration: string;
  exchangeType: string;
  giveTalents: number[];
  receiveTalents: number[];
};
type PreviewArticleModalProps = {
  imageUrls: string[];
  title: string;
  content: string;
  onCloseHandler: () => void;
} & (matchingArticlePreviewProps | communityArticlePreviewProps);

function PreviewArticleModal({
  type,
  imageUrls,
  title,
  content,
  onCloseHandler,
  ...data
}: PreviewArticleModalProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const {
    data: {
      data: { nickname, profileImg }
    }
  } = useGetProfile();

  return (
    <ModalContainer>
      <ModalBox className={"w-[800px]"}>
        <ModalHeader>
          <h1 className={"text-heading3_22_semibold text-talearnt_Text_Strong"}>
            미리보기
          </h1>
        </ModalHeader>
        <ModalBody
          bodyRef={scrollRef}
          className={classNames(
            "max-h-[600px] min-h-[400px]",
            "scrollbar scrollbar-w12-10 overflow-y-auto"
          )}
        >
          <div className={classNames("flex flex-col gap-6", "px-8 pb-6")}>
            <h1
              className={"text-heading1_30_semibold text-talearnt_Text_Strong"}
            >
              {title}
            </h1>
            <div className={"flex items-center gap-4"}>
              <Avatar imageUrl={profileImg} />
              <span className={"text-body1_18_semibold text-talearnt_Text_01"}>
                {nickname}
              </span>
              <div className={"h-5 w-px bg-talearnt_Line_01"} />
              <span className={"text-body1_18_semibold text-talearnt_Text_04"}>
                {dayjs().format("YYYY-MM-DD")}
              </span>
              <Badge
                label={
                  type === "matching"
                    ? "모집중"
                    : (data as communityArticlePreviewProps).postType
                }
                size={"medium"}
              />
            </div>
            {type === "matching" && (
              <>
                <div className={"grid grid-cols-2 gap-6"}>
                  <div className={"flex flex-col gap-2"}>
                    <label
                      className={"text-body2_16_semibold text-talearnt_Text_03"}
                    >
                      주고 싶은 나의 재능
                    </label>
                    <div className={"flex flex-wrap gap-2"}>
                      {filteredTalents(
                        (data as matchingArticlePreviewProps).giveTalents
                      ).map(({ talentCode, talentName }) => (
                        <Badge
                          label={talentName}
                          type={"keyword"}
                          size={"medium"}
                          key={`preview-giveTalent-${talentCode}`}
                        />
                      ))}
                    </div>
                  </div>
                  <div className={"flex flex-col gap-2"}>
                    <label
                      className={"text-body2_16_semibold text-talearnt_Text_03"}
                    >
                      주고 싶은 나의 재능
                    </label>
                    <div className={"flex flex-wrap gap-2"}>
                      {filteredTalents(
                        (data as matchingArticlePreviewProps).receiveTalents
                      ).map(({ talentCode, talentName }) => (
                        <Badge
                          label={talentName}
                          type={"keyword"}
                          size={"medium"}
                          key={`preview-receiveTalent-${talentCode}`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
                <div className={"flex gap-16"}>
                  <div className={"flex gap-4"}>
                    <label
                      className={"text-body2_16_semibold text-talearnt_Text_03"}
                    >
                      진행 방식
                    </label>
                    <span
                      className={"text-body2_16_semibold text-talearnt_Text_02"}
                    >
                      {(data as matchingArticlePreviewProps).exchangeType}
                    </span>
                  </div>
                  <div className={"flex gap-4"}>
                    <label
                      className={"text-body2_16_semibold text-talearnt_Text_03"}
                    >
                      진행 기간
                    </label>
                    <span
                      className={"text-body2_16_semibold text-talearnt_Text_02"}
                    >
                      {(data as matchingArticlePreviewProps).duration}
                    </span>
                  </div>
                </div>
              </>
            )}
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
                        "h-[152px] w-[152px] cursor-pointer overflow-hidden rounded-2xl"
                      )}
                      key={url}
                    >
                      <img
                        className={"h-full w-full object-cover"}
                        src={url}
                        alt={`${index}번째 업로드 이미지`}
                      />
                      {imageUrls.length > 4 && (
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
            <p dangerouslySetInnerHTML={{ __html: content }} />
          </div>
        </ModalBody>
        <ModalBottom className={"justify-center"}>
          <Button onClick={onCloseHandler} size={"large"}>
            확인
          </Button>
        </ModalBottom>
      </ModalBox>
    </ModalContainer>
  );
}

export { PreviewArticleModal };
