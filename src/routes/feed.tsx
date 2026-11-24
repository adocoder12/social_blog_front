import { useState } from "react";
import PageHeader from "@components/PageHeader/PageHeader";
import PostList from "@components/PostList/PostList";
import Container from "@components/UI/Container/Container";
import PillsButtons from "@components/UI/PillsButtons/PillsButtons";
import { usePosts } from "@hooks/usePosts";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/feed")({
  head: () => ({
    meta: [
      { title: "Feed — Social Blog" },
      {
        name: "description",
        content: "A place to share your thoughts and ideas with the world.",
      },
    ],
  }),
  component: FeedPage,
});

const filters = [
  { label: "All", value: "all" },
  { label: "Popular", value: "popular" },
];

function FeedPage() {
  const [filter, setFilter] = useState("all");
  const { data: posts, isPending, isError } = usePosts();

  // "All" = newest first, "Popular" = most comments first
  const sorted = (posts ?? []).toSorted((a, b) =>
    filter === "popular"
      ? b.comments.length - a.comments.length
      : b.created_at.localeCompare(a.created_at),
  );

  return (
    <>
      <Container>
        <PageHeader
          title="Welcome to the Social Blog"
          subtitle="Fresh from the community."
        />
        <PillsButtons items={filters} value={filter} onChange={setFilter} />
      </Container>

      {isPending && <p>Loading posts…</p>}
      {isError && <p>Could not load posts.</p>}

      {posts && <PostList posts={sorted} />}
    </>
  );
}
