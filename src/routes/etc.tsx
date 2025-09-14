import { lazy, Suspense } from "react";
import { RouteObject } from "react-router-dom";

const AgreementsDetail = lazy(() => import("@pages/etc/AgreementsDetail"));

const etcRouter: RouteObject[] = [
  {
    element: (
      <Suspense>
        <AgreementsDetail />
      </Suspense>
    ),
    path: "agreements/:agreementsType",
  },
];

export default etcRouter;
