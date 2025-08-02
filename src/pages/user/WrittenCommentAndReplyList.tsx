import { useState } from "react";
import { useNavigate } from "react-router-dom";

import dayjs from "dayjs";
import { useShallow } from "zustand/shallow";

import { classNames } from "@shared/utils/classNames";

import {
  useGetWrittenCommentList,
  useGetWrittenReplyList,
} from "@features/user/writtenCommentAndReplyList/writtenCommentAndReplyList.hook";

import {
  useWrittenCommentPageStore,
  useWrittenReplyPageStore,
} from "@features/user/writtenCommentAndReplyList/writtenCommentAndReplyList.store";

import { Badge } from "@components/common/Badge/Badge";
import { EmptyState } from "@components/common/EmptyState/EmptyState";
import { Pagination } from "@components/common/Pagination/Pagination";
import { TabSlider } from "@components/common/TabSlider/TabSlider";

import {
  writtenCommentType,
  writtenReplyType,
} from "@features/user/writtenCommentAndReplyList/writtenCommentAndReplyList.type";

const tabOptions = [
  { label: "댓글", value: "comment" },
  { label: "답변", value: "reply" },
];

function WrittenCommentAndReplyList() {
  const navigator = useNavigate();

  const [tab, setTab] = useState<"comment" | "reply">("comment");

  const writtenCommentPageStore = useWrittenCommentPageStore(
    useShallow(state => ({
      page: state.page,
      setPage: state.setPage,
    }))
  );
  const writtenReplyPageStore = useWrittenReplyPageStore(
    useShallow(state => ({
      page: state.page,
      setPage: state.setPage,
    }))
  );

  const {
    data: { data: writtenCommentList },
  } = useGetWrittenCommentList(tab === "comment");
  const {
    data: { data: writtenReplyList },
  } = useGetWrittenReplyList(tab === "reply");

  const handleTabChange = (value: string) => {
    setTab(value as "comment" | "reply");

    if (value === "comment") {
      writtenCommentPageStore.setPage(1);
    } else {
      writtenReplyPageStore.setPage(1);
    }
  };
  const handleEmptyStateButtonClick = () => navigator("community");
  const handlePageChange = (page: number) => {
    currentPageStore.setPage(page);
    window.scrollTo({ top: 0 });
  };

  const { results, pagination } =
    tab === "comment" ? writtenCommentList : writtenReplyList;
  const currentPageStore =
    tab === "comment" ? writtenCommentPageStore : writtenReplyPageStore;
  const currentTabLabel = tab === "comment" ? "댓글" : "답변";

  return (
    <div className={"flex flex-col"}>
      <TabSlider
        currentValue={tab}
        options={tabOptions}
        onClickHandler={handleTabChange}
        type={"shadow"}
      />
      {results.length === 0 ? (
        <div
          className={classNames(
            "grid place-items-center",
            "mt-6 h-[756px] rounded-[20px] border border-talearnt_Line_01"
          )}
        >
          <EmptyState
            title={`아직 ${currentTabLabel}을 남기지 않았어요`}
            description={
              "공감하거나 나누고 싶은 생각이 있다면, 댓글로 시작해보세요!"
            }
            buttonText={`${currentTabLabel} 작성하기`}
            buttonOnClick={handleEmptyStateButtonClick}
          />
        </div>
      ) : (
        <>
          <div className={classNames("flex items-center", "my-4 h-10")}>
            <span className={"text-heading3_22_semibold text-talearnt_Text_02"}>
              총
            </span>
            <span
              className={classNames(
                "ml-1",
                "text-heading2_24_semibold text-talearnt_Primary_01"
              )}
            >
              {pagination.totalCount}
            </span>
            <span className={"text-heading3_22_semibold text-talearnt_Text_02"}>
              개의 {currentTabLabel}을 작성했어요
            </span>
          </div>
          <div className={"flex flex-col gap-6"}>
            {results.map(({ postNo, postTitle, postType, ...rest }) => {
              const isComment = tab === "comment";
              const key = isComment
                ? (rest as writtenCommentType).commentNo
                : (rest as writtenReplyType).replyNo;
              const content = isComment
                ? (rest as writtenCommentType).commentContent
                : (rest as writtenReplyType).replyContent;
              const createdAt = isComment
                ? (rest as writtenCommentType).commentCreatedAt
                : (rest as writtenReplyType).replyCreatedAt;
              const updatedAt = isComment
                ? (rest as writtenCommentType).commentUpdatedAt
                : (rest as writtenReplyType).replyUpdatedAt;

              return (
                <div
                  className={classNames(
                    "flex flex-col gap-4",
                    "rounded-2xl border border-talearnt_Line_01 p-[23px]",
                    "cursor-pointer",
                    "hover:border-talearnt_Primary_01"
                  )}
                  onClick={() => navigator(`/community-article/${postNo}`)}
                  key={key}
                >
                  <div className="flex items-center gap-2">
                    <Badge label={postType} color={"skyblue"} />
                    <p className="text-body3_14_medium text-talearnt_Text_02">
                      {postTitle}
                    </p>
                    <span className="text-body3_14_medium text-talearnt_Primary_01">
                      에 남긴 {currentTabLabel}
                    </span>
                  </div>
                  <p className="line-clamp-3 text-body1_18_medium text-talearnt_Text_Strong">
                    {content}
                  </p>
                  <span className="text-caption1_14_medium text-talearnt_Text_03">
                    {dayjs(updatedAt ?? createdAt).format("YYYY.MM.DD HH:mm")}
                  </span>
                </div>
              );
            })}
          </div>
          <Pagination
            className={"mt-14"}
            currentPage={currentPageStore.page}
            totalPages={pagination.totalPages}
            handlePageChange={handlePageChange}
          />
        </>
      )}
    </div>
  );
}

export default WrittenCommentAndReplyList;
