import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";

import router from "@routes/index";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

import "./index.css";

const mode = import.meta.env.MODE;
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 0,
      staleTime: Infinity,
      refetchOnWindowFocus: false
    },
    mutations: {
      retry: 0
    }
  }
});
const root = document.getElementById("root");

if (root) {
  createRoot(root).render(
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
      {mode === "development" && <ReactQueryDevtools initialIsOpen={false} />}
    </QueryClientProvider>
  );
}
