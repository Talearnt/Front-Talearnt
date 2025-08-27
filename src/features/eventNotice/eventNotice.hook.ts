import { useParams } from "react-router-dom";

import {
  getEventDetail,
  getEventList,
  getNoticeDetail,
  getNoticeList,
} from "@features/eventNotice/eventNotice.api";

import { createQueryKey } from "@shared/utils/createQueryKey";

import { useQueryWithInitial } from "@shared/hooks/useQueryWithInitial";

import {
  useEventPageStore,
  useNoticePageStore,
} from "@features/eventNotice/eventNotice.store";

import { queryKeys } from "@shared/constants/queryKeys";

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
      queryKey: createQueryKey([queryKeys.EVENT, size, page], { isList: true }),
      queryFn: () => getEventList({ page, size }),
      enabled,
    },
    createQueryKey([queryKeys.EVENT, size], { isList: true })
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
      queryKey: createQueryKey([queryKeys.NOTICE, size, page], {
        isList: true,
      }),
      queryFn: () => getNoticeList({ page, size }),
      enabled,
    },
    createQueryKey([queryKeys.NOTICE, size], { isList: true })
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
      queryKey: createQueryKey([queryKeys.EVENT, no]),
      queryFn: () => getEventDetail(no),
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
      queryKey: createQueryKey([queryKeys.NOTICE, no]),
      queryFn: () => getNoticeDetail(no),
    }
  );
};
