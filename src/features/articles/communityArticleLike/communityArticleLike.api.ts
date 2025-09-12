import { postAPI } from "@shared/utils/apiMethods";

import { communityArticleType } from "@features/articles/communityArticleList/communityArticleList.type";
export const postCommunityArticleLike = ({
  communityPostNo,
  isLike,
}: Pick<communityArticleType, "communityPostNo" | "isLike">) =>
  postAPI(
    `/v1/posts/communities/${communityPostNo}/like`,
    { like: isLike },
    {
      withCredentials: true,
    }
  );
