import { lazy, Suspense } from "react";
import { RouteObject } from "react-router-dom";

const EventNoticeList = lazy(
  () => import("@pages/eventNotice/EventNoticeList")
);
const EventDetail = lazy(() => import("@pages/eventNotice/EventDetail"));
const NoticeDetail = lazy(() => import("@pages/eventNotice/NoticeDetail"));

const eventNoticeRouter: RouteObject[] = [
  {
    element: (
      <Suspense>
        <EventNoticeList />
      </Suspense>
    ),
    path: "event-notice/:tab",
  },
  {
    element: (
      <Suspense>
        <EventDetail />
      </Suspense>
    ),
    path: "event-notice/event/:eventNo",
  },
  {
    element: (
      <Suspense>
        <NoticeDetail />
      </Suspense>
    ),
    path: "event-notice/notice/:noticeNo",
  },
];

export default eventNoticeRouter;
