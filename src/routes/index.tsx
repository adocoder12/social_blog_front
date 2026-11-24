import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Social Blog" },
      {
        name: "description",
        content: "A place to share your thoughts and ideas with the world.",
      },
    ],
  }),
  component: Homepage,
});

function Homepage() {
  return <div>Hello "/"!</div>;
}
