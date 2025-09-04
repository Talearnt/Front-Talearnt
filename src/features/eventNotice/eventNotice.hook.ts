import { useParams } from "react-router-dom";

import {
  getEventDetail,
  getEventList,
  getNoticeDetail,
  getNoticeList,
} from "@features/eventNotice/eventNotice.api";

import { useQueryWithInitial } from "@shared/hooks/useQueryWithInitial";

import {
  useEventPageStore,
  useNoticePageStore,
} from "@features/eventNotice/eventNotice.store";

import { CACHE_POLICIES } from "@shared/cache/policies/cachePolicies";
import { QueryKeyFactory } from "@shared/cache/queryKeys/queryKeyFactory";

type commonPropsType = {
  enabled?: boolean;
  size?: number;
};

// 이벤트 리스트 조회
export const useGetEventList = ({ enabled = true, size }: commonPropsType) => {
  const page = useEventPageStore(state => state.page);

  return useQueryWithInitial(
    {
      results: [],
      pagination: {
        hasNext: false,
        hasPrevious: false,
        totalPages: 1,
        currentPage: 1,
        totalCount: 0,
        latestCreatedAt: "",
      },
    },
    {
      queryKey: QueryKeyFactory.event.list({ size, page }),
      queryFn: () => getEventList({ page, size }),
      enabled,
      ...CACHE_POLICIES.EVENT_NOTICE,
    },
    QueryKeyFactory.event.lists()
  );
};

// 공지사항 리스트 조회
export const useGetNoticeList = ({ enabled = true, size }: commonPropsType) => {
  const page = useNoticePageStore(state => state.page);

  return useQueryWithInitial(
    {
      results: [],
      pagination: {
        hasNext: false,
        hasPrevious: false,
        totalPages: 1,
        currentPage: 1,
        totalCount: 0,
        latestCreatedAt: "",
      },
    },
    {
      queryKey: QueryKeyFactory.notice.list({ size, page }),
      queryFn: () => getNoticeList({ page, size }),
      enabled,
      ...CACHE_POLICIES.EVENT_NOTICE,
    },
    QueryKeyFactory.notice.lists()
  );
};

// 이벤트 상세 조회
export const useGetEventDetail = () => {
  const { eventNo } = useParams();

  const no = Number(eventNo);

  return useQueryWithInitial(
    {
      bannerUrl: "",
      content: "",
      endDate: "",
      eventNo: 0,
      isActive: true,
      startDate: "",
    },
    {
      queryKey: QueryKeyFactory.event.detail(no),
      queryFn: () => getEventDetail(no),
      ...CACHE_POLICIES.EVENT_NOTICE,
    }
  );
};

// 공지사항 상세 조회
export const useGetNoticeDetail = () => {
  const { noticeNo } = useParams();

  const no = Number(noticeNo);

  return useQueryWithInitial(
    {
      noticeNo: 0,
      title: "",
      content: "",
      noticeType: "",
      createdAt: "",
    },
    {
      queryKey: QueryKeyFactory.notice.detail(no),
      queryFn: () => getNoticeDetail(no),
      ...CACHE_POLICIES.EVENT_NOTICE,
    }
  );
};
