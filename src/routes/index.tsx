import { createBrowserRouter } from "react-router-dom";

import MainLayout from "@layout/MainLayout/MainLayout";
import articlesRouter from "@routes/articles";
import authRouter from "@routes/auth";

const router = createBrowserRouter([
  {
    element: <MainLayout />,
    path: "/",
    children: [...authRouter, ...articlesRouter]
  }
]);

export default router;
