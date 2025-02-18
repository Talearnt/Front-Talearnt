import { useRef } from "react";

import dayjs from "dayjs";

import { classNames } from "@utils/classNames";

import { useFilteredTalents } from "@hook/useFilteredTalents";
import { useGetProfile } from "@hook/user.hook";

import { Avatar } from "@components/Avatar/Avatar";
import { Badge } from "@components/Badge/Badge";
import { Button } from "@components/Button/Button";
import { ModalBody } from "@components/modal/ModalBody/ModalBody";
import { ModalBottom } from "@components/modal/ModalBottom/ModalBottom";
import { ModalBox } from "@components/modal/ModalBox/ModalBox";
import { ModalContainer } from "@components/modal/ModalContainer/ModalContainer";
import { ModalHeader } from "@components/modal/ModalHeader/ModalHeader";

import { postType } from "@pages/articles/articles.type";
import { articleType } from "@pages/articles/WriteArticle/core/writeArticle.type";

type PreviewArticleModalProps = {
  type: articleType;
  duration: string;
  exchangeType: string;
  giveTalents: number[];
  receiveTalents: number[];
  postType: postType;
  imageUrls: string[];
  title: string;
  content: string;
  onCloseHandler: () => void;
};

function PreviewArticleModal({
  type,
  duration,
  exchangeType,
  giveTalents,
  receiveTalents,
  postType,
  imageUrls,
  title,
  content,
  onCloseHandler
}: PreviewArticleModalProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const {
    data: {
      data: { nickname, profileImg }
    }
  } = useGetProfile();

  const giveTalentsList = useFilteredTalents(giveTalents);
  const receiveTalentsList = useFilteredTalents(receiveTalents);

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
            "mr-[10px] max-h-[600px] min-h-[400px] pr-[9px]",
            "scrollbar scrollbar-w12-10 overflow-y-scroll"
          )}
        >
          <div
            className={classNames(
              "flex flex-col gap-6",
              "border-r border-r-transparent px-8 pb-6"
            )}
          >
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
                label={type === "match" ? "모집중" : postType}
                size={"medium"}
              />
            </div>
            {type === "match" && (
              <>
                <div className={"grid grid-cols-2 gap-6"}>
                  <div className={"flex flex-col gap-2"}>
                    <label
                      className={"text-body2_16_semibold text-talearnt_Text_03"}
                    >
                      주고 싶은 나의 재능
                    </label>
                    <div className={"flex flex-wrap gap-2"}>
                      {giveTalentsList.map(({ talentCode, talentName }) => (
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
                      {receiveTalentsList.map(({ talentCode, talentName }) => (
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
                      {exchangeType}
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
                      {duration}
                    </span>
                  </div>
                </div>
              </>
            )}
            {imageUrls.length > 0 && (
              <div
                className={classNames(
                  "grid grid-cols-4 gap-4",
                  "rounded-2xl bg-talearnt_BG_Up_02 p-6"
                )}
              >
                {imageUrls.map((url, index) => {
                  if (index > 3) {
                    return null;
                  }

                  return (
                    <div className={"relative"}>
                      <img
                        className={
                          "aspect-square w-full rounded-2xl object-cover"
                        }
                        src={url}
                        alt={`${index}번째 업로드 이미지`}
                      />
                      {index === 3 && (
                        <div
                          className={classNames(
                            "absolute top-0",
                            "flex items-center justify-center",
                            "h-full w-full rounded-2xl bg-[rgba(0,0,0,0.6)]"
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
