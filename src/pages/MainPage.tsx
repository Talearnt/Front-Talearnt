import { useNavigate } from "react-router-dom";

import { classNames } from "@shared/utils/classNames";

import { useGetEventList } from "@features/event/event.hook";
import {
  useGetBestCommunityArticleList,
  useGetPersonalizedMatchingArticleList,
  useGetRecentMatchingArticleList,
} from "@features/mainPage/mainPage.hook";
import { useGetNoticeList } from "@features/notice/notice.hook";
import { useGetProfile } from "@features/user/profile/profile.hook";

import { MatchingArticleCard } from "@components/articles/matchingArticleList/MatchingArticleCard/MatchingArticleCard";
import { ArticleSection } from "@components/mainPage/ArticleSection/ArticleSection";
import { BannerCarousel } from "@components/mainPage/BannerCarousel/BannerCarousel";
import { CommunityArticleCard } from "@components/mainPage/CommunityArticleCard/CommunityArticleCard";
import { NoticeEventTabSection } from "@components/mainPage/NoticeEventTabSection/NoticeEventTabSection";

function MainPage() {
  const navigator = useNavigate();

  // 프로필 정보
  const {
    data: {
      data: { nickname },
    },
  } = useGetProfile();
  // 맞춤 매칭 게시물 목록
  const {
    data: {
      data: { results: personalizedMatchingArticleList },
    },
    isSuccess,
  } = useGetPersonalizedMatchingArticleList();
  // 신규 매칭 게시물 목록
  const {
    data: {
      data: { results: recentMatchingArticleList },
    },
  } = useGetRecentMatchingArticleList();
  // 커뮤니티 게시물 목록
  const {
    data: {
      data: { results: bestCommunityArticleList },
    },
  } = useGetBestCommunityArticleList();
  // 공지사항 목록
  const {
    data: {
      data: { results: noticeList },
    },
  } = useGetNoticeList(4);
  // 이벤트 목록
  const {
    data: {
      data: { results: eventList },
    },
  } = useGetEventList(2);

  return (
    <div className={classNames("flex flex-col gap-14", "pt-10")}>
      {/* 배너 */}
      <BannerCarousel />
      {/* 맞춤 매칭 게시물 목록 */}
      {isSuccess && personalizedMatchingArticleList.length > 0 && (
        <ArticleSection
          title={
            <>
              <span className="text-talearnt_Primary_01">{nickname}</span>님을
              위한 맞춤 매칭
            </>
          }
        >
          {personalizedMatchingArticleList.map(
            ({ exchangePostNo, ...article }) => (
              <MatchingArticleCard
                {...article}
                onClickHandler={() =>
                  navigator(`/matching-article/${exchangePostNo}`)
                }
                exchangePostNo={exchangePostNo}
                key={exchangePostNo}
              />
            )
          )}
        </ArticleSection>
      )}
      {/* 신규 매칭 게시물 목록 */}
      <ArticleSection title={"신규 매칭 게시물이 올라왔어요!"}>
        {recentMatchingArticleList.map(({ exchangePostNo, ...article }) => (
          <MatchingArticleCard
            {...article}
            onClickHandler={() =>
              navigator(`/matching-article/${exchangePostNo}`)
            }
            exchangePostNo={exchangePostNo}
            key={exchangePostNo}
          />
        ))}
      </ArticleSection>
      {/* 신규 커뮤니티 게시물 목록 */}
      <ArticleSection
        title={"신규 커뮤니티 게시물이 올라왔어요!"}
        articleType={"community"}
      >
        {bestCommunityArticleList.map(
          ({ communityPostNo, ...article }, index) => (
            <CommunityArticleCard
              {...article}
              onClickHandler={() =>
                navigator(`/community-article/${communityPostNo}`)
              }
              index={index}
              key={index}
            />
          )
        )}
      </ArticleSection>
      {/* 이벤트, 공지사항 */}
      <NoticeEventTabSection noticeList={noticeList} eventList={eventList} />
    </div>
  );
}

export default MainPage;
