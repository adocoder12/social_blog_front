import { createRootRoute, Outlet } from "@tanstack/react-router";
import Footer from "@components/Footer/Footer";
import Header from "@components/Header/Header";
import NotFound from "@components/NotFoundPage/NotFoundPage";

export const Route = createRootRoute({
  component: RootLayout,
  notFoundComponent: NotFound,
});

function RootLayout() {
  return (
    <div className="app">
      <Header />
      <main className="main-container">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
