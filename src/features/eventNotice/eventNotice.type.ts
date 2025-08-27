export type eventType = {
  eventNo: number;
  bannerUrl: string;
  startDate: string;
  endDate: string;
  isActive: boolean;
};

export type noticeType = {
  noticeNo: number;
  title: string;
  noticeType: string;
  content: string;
  createdAt: string;
};

export type eventDetailType = {
  bannerUrl: string;
  content: string;
  endDate: string;
  eventNo: number;
  isActive: boolean;
  startDate: string;
};

export type noticeDetailType = {
  content: string;
  createdAt: string;
  noticeNo: number;
  noticeType: string;
  title: string;
};
