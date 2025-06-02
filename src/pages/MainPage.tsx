import { useNavigate } from "react-router-dom";

import { classNames } from "@shared/utils/classNames";

import {
  useGetBestCommunityArticleList,
  useGetPersonalizedMatchingArticleList,
  useGetRecentMatchingArticleList,
} from "@features/mainPage/mainPage.hook";
import { useGetProfile } from "@features/user/user.hook";

import { MatchingArticleCard } from "@components/articles/matchingArticleList/MatchingArticleCard/MatchingArticleCard";
import { ArticleSection } from "@components/mainPage/ArticleSection/ArticleSection";
import { BannerCarousel } from "@components/mainPage/BannerCarousel/BannerCarousel";
import { CommunityArticleCard } from "@components/mainPage/CommunityArticleCard/CommunityArticleCard";
import { NoticeEventTabSection } from "@components/mainPage/NoticeEventTabSection/NoticeEventTabSection";

function MainPage() {
  const navigator = useNavigate();

  const {
    data: {
      data: { nickname },
    },
  } = useGetProfile();
  const {
    data: {
      data: { results: personalizedMatchingArticleList },
    },
    isSuccess,
  } = useGetPersonalizedMatchingArticleList();
  const {
    data: {
      data: { results: recentMatchingArticleList },
    },
  } = useGetRecentMatchingArticleList();
  const {
    data: {
      data: { results: bestCommunityArticleList },
    },
  } = useGetBestCommunityArticleList();

  return (
    <div className={classNames("flex flex-col gap-14", "pt-10")}>
      {/* 배너 */}
      <BannerCarousel />
      {/* 맞춤 매칭 게시물 목록 */}
      {isSuccess && (
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
      <NoticeEventTabSection />
    </div>
  );
}

export default MainPage;
