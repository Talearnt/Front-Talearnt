import { useNavigate } from "react-router-dom";

import {
  useGetBestCommunityArticleList,
  useGetPersonalizedMatchingArticleList,
  useGetRecentMatchingArticleList,
} from "@features/mainPage/mainPage.hook";
import { useGetProfile } from "@features/user/profile/profile.hook";

import { EmptyState } from "@components/common/EmptyState/EmptyState";
import { ArticleSection } from "@components/mainPage/ArticleSection/ArticleSection";
import { BannerCarousel } from "@components/mainPage/BannerCarousel/BannerCarousel";
import { EventNoticeTabSection } from "@components/mainPage/EventNoticeTabSection/EventNoticeTabSection";
import { CommunityArticleCard } from "@components/shared/CommunityArticleCard/CommunityArticleCard";
import { MatchingArticleCard } from "@components/shared/MatchingArticleCard/MatchingArticleCard";
import { SkeletonCommunityArticleCard } from "@components/shared/SkeletonCommunityArticleCard/SkeletonCommunityArticleCard";
import { SkeletonMatchingArticleCard } from "@components/shared/SkeletonMatchingArticleCard/SkeletonMatchingArticleCard";

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
    isSuccess: isPersonalizedMatchingArticleListSuccess,
  } = useGetPersonalizedMatchingArticleList();
  // 신규 매칭 게시물 목록
  const {
    data: {
      data: { results: recentMatchingArticleList },
    },
    isSuccess: isRecentMatchingArticleListSuccess,
    isLoading: isRecentMatchingArticleListLoading,
  } = useGetRecentMatchingArticleList();
  // 커뮤니티 게시물 목록
  const {
    data: {
      data: { results: bestCommunityArticleList },
    },
    isSuccess: isBestCommunityArticleListSuccess,
    isLoading: isBestCommunityArticleListLoading,
  } = useGetBestCommunityArticleList();

  return (
    <div className={"flex flex-col gap-14"}>
      {/* 배너 */}
      <BannerCarousel />
      {personalizedMatchingArticleList.length === 0 &&
      recentMatchingArticleList.length === 0 &&
      bestCommunityArticleList.length === 0 &&
      isPersonalizedMatchingArticleListSuccess &&
      isRecentMatchingArticleListSuccess &&
      isBestCommunityArticleListSuccess ? (
        <EmptyState
          title={"첫 글을 기다리고 있어요!"}
          description={"매칭이나 커뮤니티에서 당신의 첫 글을 남겨보세요"}
          buttonData={{
            buttonText: "게시물 작성하기",
            buttonOnClick: () => navigator("/write-article/matching"),
          }}
        />
      ) : (
        <>
          {/* 맞춤 매칭 게시물 목록 */}
          {isPersonalizedMatchingArticleListSuccess &&
            personalizedMatchingArticleList.length > 0 && (
              <ArticleSection
                title={
                  <>
                    <span className="text-talearnt_Primary_01">{nickname}</span>
                    님을 위한 맞춤 매칭
                  </>
                }
              >
                {personalizedMatchingArticleList.map(article => (
                  <MatchingArticleCard
                    {...article}
                    key={article.exchangePostNo}
                  />
                ))}
              </ArticleSection>
            )}
          {/* 신규 매칭 게시물 목록 */}
          <ArticleSection title={"신규 매칭 게시물이 올라왔어요!"}>
            {isRecentMatchingArticleListSuccess
              ? recentMatchingArticleList.map(article => (
                  <MatchingArticleCard
                    {...article}
                    key={article.exchangePostNo}
                  />
                ))
              : isRecentMatchingArticleListLoading
                ? Array.from({ length: 4 }).map((_, index) => (
                    <SkeletonMatchingArticleCard key={index} />
                  ))
                : null}
          </ArticleSection>
          {/* BEST 커뮤니티 게시물 목록 */}
          <ArticleSection
            title={"BEST 커뮤니티 게시물이 올라왔어요!"}
            articleType={"community"}
          >
            {isBestCommunityArticleListSuccess
              ? bestCommunityArticleList.map((article, index) => (
                  <CommunityArticleCard
                    {...article}
                    index={index}
                    key={index}
                  />
                ))
              : isBestCommunityArticleListLoading
                ? Array.from({ length: 4 }).map((_, index) => (
                    <SkeletonCommunityArticleCard key={index} />
                  ))
                : null}
          </ArticleSection>
        </>
      )}
      {/* 이벤트, 공지사항 */}
      <EventNoticeTabSection />
    </div>
  );
}

export default MainPage;
