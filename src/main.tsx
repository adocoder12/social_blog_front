// Global styles first, so Tailwind sets the layer order before any component module
import "@styles/index.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { createRouter, RouterProvider } from "@tanstack/react-router";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { routeTree } from "./routeTree.gen";

const queryClient = new QueryClient();
// queryClient goes into the router context so route loaders can prefetch data
const router = createRouter({ routeTree, context: { queryClient } });

// Makes links and params type-safe
declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
    scrollRestoration: true;
  }
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
      <ReactQueryDevtools />
    </QueryClientProvider>
  </StrictMode>,
);
