import { useNavigate } from "react-router-dom";

import { classNames } from "@utils/classNames";

import { useGetProfile } from "@hook/user.hook";
import {
  useGetBestCommunityArticleList,
  useGetPersonalizedMatchingArticleList,
  useGetRecentMatchingArticleList
} from "@pages/MainPage/core/mainPage.hook";

import { MatchingArticleCard } from "@pages/articles/MatchingArticleList/components/MatchingArticleCard/MatchingArticleCard";
import { ArticleSection } from "@pages/MainPage/components/ArticleSection/ArticleSection";
import { BannerCarousel } from "@pages/MainPage/components/BannerCarousel/BannerCarousel";
import { CommunityArticleCard } from "@pages/MainPage/components/CommunityArticleCard/CommunityArticleCard";

function MainPage() {
  const navigator = useNavigate();

  const {
    data: {
      data: { nickname }
    }
  } = useGetProfile();
  const {
    data: {
      data: { results: personalizedMatchingArticleList }
    },
    isSuccess
  } = useGetPersonalizedMatchingArticleList();
  const {
    data: {
      data: { results: recentMatchingArticleList }
    }
  } = useGetRecentMatchingArticleList();
  const {
    data: {
      data: { results: bestCommunityArticleList }
    }
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
    </div>
  );
}

export default MainPage;
