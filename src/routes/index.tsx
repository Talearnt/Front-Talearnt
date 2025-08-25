import { lazy, Suspense } from "react";
import { createBrowserRouter } from "react-router-dom";

import articlesRouter from "@routes/articles";
import authRouter from "@routes/auth";
import eventNoticeRouter from "@routes/eventNotice";
import userRouter from "@routes/user";

import MainLayout from "@layout/MainLayout";

const MainPage = lazy(() => import("@pages/MainPage"));

const router = createBrowserRouter([
  {
    element: <MainLayout />,
    path: "/",
    children: [
      {
        element: (
          <Suspense>
            <MainPage />
          </Suspense>
        ),
        index: true,
      },
      ...authRouter,
      ...articlesRouter,
      ...eventNoticeRouter,
      ...userRouter,
    ],
  },
]);

export default router;
