import { useParams } from "react-router-dom";

import { getMatchingArticleDetail } from "@pages/articles/MatchingArticleDetail/core/matchingArticleDetail.api";

import { createQueryKey } from "@utils/createQueryKey";

import { useQueryWithInitial } from "@hook/useQueryWithInitial";

import { queryKeys } from "@common/common.constants";

export const useGetMatchingArticleDetail = () => {
  const { exchangePostNo } = useParams();

  const postNo = Number(exchangePostNo);

  return useQueryWithInitial(
    {
      userNo: 0,
      nickname: "",
      profileImg: null,
      title: "",
      content: "",
      duration: "기간 미정",
      exchangeType: "온라인",
      giveTalents: [],
      receiveTalents: [],
      exchangePostNo: 0,
      status: "모집중",
      createdAt: "",
      favoriteCount: 0,
      isFavorite: false,
      imageUrls: [],
      count: 0
    },
    {
      queryKey: createQueryKey([queryKeys.MATCH, postNo]),
      queryFn: async () => await getMatchingArticleDetail(postNo),
      enabled: exchangePostNo !== undefined
    }
  );
};
