import type { QueryClient } from "@tanstack/react-query";
import {
  createRootRouteWithContext,
  HeadContent,
  Outlet,
} from "@tanstack/react-router";
import Footer from "@components/Footer/Footer";
import Header from "@components/Header/Header";
import NotFound from "@components/NotFoundPage/NotFoundPage";

// What every route's loader receives as `context`
type RouterContext = {
  queryClient: QueryClient;
};

export const Route = createRootRouteWithContext<RouterContext>()({
  // Defaults; a page's own head() overrides them
  head: () => ({
    meta: [
      { title: "Social Blog" },
      {
        name: "description",
        content: "A place to share your thoughts and ideas with the world.",
      },
      { property: "og:site_name", content: "Social Blog" },
    ],
  }),
  component: RootLayout,
  notFoundComponent: NotFound,
});

function RootLayout() {
  return (
    <>
      {/* Writes each page's title and meta tags into <head> */}
      <HeadContent />
      <div className="app">
        <Header />
        <main className="main-container">
          <Outlet />
        </main>
        <Footer />
      </div>
    </>
  );
}
