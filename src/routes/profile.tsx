import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/profile")({
  head: () => ({
    meta: [
      { title: "Profile — Social Blog" },
      { name: "description", content: "Your posts and activity." },
    ],
  }),
  component: ProfilePage,
});

function ProfilePage() {
  return <h1>Profile</h1>;
}
