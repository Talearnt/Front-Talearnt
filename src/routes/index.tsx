import { lazy } from "react";
import { createBrowserRouter } from "react-router-dom";

import MainLayout from "@layout/MainLayout/MainLayout";
import articlesRouter from "@routes/articles";
import authRouter from "@routes/auth";

const MainPage = lazy(() => import("@pages/MainPage/MainPage"));

const router = createBrowserRouter([
  {
    element: <MainLayout />,
    path: "/",
    children: [
      { element: <MainPage />, index: true },
      ...authRouter,
      ...articlesRouter
    ]
  }
]);

export default router;
