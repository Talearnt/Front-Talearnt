import { lazy, Suspense } from "react";
import { RouteObject } from "react-router-dom";

const EventNoticePage = lazy(() => import("@pages/EventNoticePage"));

const eventNoticeRouter: RouteObject[] = [
  {
    element: (
      <Suspense>
        <EventNoticePage />
      </Suspense>
    ),
    path: "event-notice/:tab",
  },
];

export default eventNoticeRouter;
