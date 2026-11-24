import Profile from "@components/Profile/Profile";
import BackLink from "@components/UI/BackLink/BackLink";
import { userQueryOptions, useUser } from "@hooks/useUsers";
import { createFileRoute } from "@tanstack/react-router";

// Stands in for the logged-in user until the API has auth
const CURRENT_USER_ID = 1;

export const Route = createFileRoute("/profile")({
  // Load the user before the page renders, so head() can use it.
  // staleTime "static" = use the cached user if there is one, otherwise fetch it
  loader: ({ context }) =>
    context.queryClient.query({
      ...userQueryOptions(CURRENT_USER_ID),
      staleTime: "static",
    }),
  head: ({ loaderData: user }) => ({
    meta: [
      {
        title: user
          ? `${user.username} — Social Blog`
          : "Profile — Social Blog",
      },
      { name: "description", content: "Your posts and activity." },
    ],
  }),
  errorComponent: () => <p>Could not load this profile.</p>,
  component: ProfilePage,
});

function ProfilePage() {
  // Already in the cache thanks to the loader
  const { data: user } = useUser(CURRENT_USER_ID);

  if (!user) return null;

  return (
    <>
      <Profile user={user} />
      <BackLink to="/feed">Back to Posts</BackLink>
    </>
  );
}
