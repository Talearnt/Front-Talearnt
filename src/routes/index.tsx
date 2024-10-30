import { createBrowserRouter } from "react-router-dom";

import authRouter from "@routes/auth";

import MainLayout from "@layout/MainLayout/MainLayout";

const router = createBrowserRouter([
  {
    element: <MainLayout />,
    path: "/",
    children: [...authRouter]
  }
]);

export default router;
