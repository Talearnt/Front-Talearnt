import { createBrowserRouter } from "react-router-dom";

import MainLayout from "@layout/MainLayout/MainLayout";

const router = createBrowserRouter([
  {
    element: <MainLayout />,
    path: "/"
  }
]);

export default router;
