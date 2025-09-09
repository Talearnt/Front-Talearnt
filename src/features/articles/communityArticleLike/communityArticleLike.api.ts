import { postAPI } from "@shared/utils/apiMethods";

export const postCommunityArticleLike = (communityPostNo: number) =>
  postAPI(`/v1/posts/communities/${communityPostNo}/like`, undefined, {
    withCredentials: true,
  });
