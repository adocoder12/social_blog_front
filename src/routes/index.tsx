import { useState } from "react";
import PageHeader from "@components/PageHeader/PageHeader";
import PostList from "@components/PostList/PostList";
import Container from "@components/UI/Container/Container";
import PillsButtons from "@components/UI/PillsButtons/PillsButtons";
import { usePosts } from "@hooks/usePosts";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Feed — Social Blog" },
      {
        name: "description",
        content: "A place to share your thoughts and ideas with the world.",
      },
    ],
  }),
  component: Homepage,
});

const filters = [
  { label: "All", value: "all" },
  { label: "Popular", value: "popular" },
];

function Homepage() {
  const [filter, setFilter] = useState("all");
  const { data: posts, isPending, isError } = usePosts();

  // "All" = newest first, "Popular" = most comments first
  const sorted = [...(posts ?? [])].sort((a, b) =>
    filter === "popular"
      ? b.comments.length - a.comments.length
      : b.created_at.localeCompare(a.created_at),
  );

  return (
    <>
      <Container>
        <PageHeader
          title="Welcome to the Social Blog"
          subtitle="A place to share your thoughts and ideas with the world."
        />
        <PillsButtons items={filters} value={filter} onChange={setFilter} />
      </Container>

      {isPending && <p>Loading posts…</p>}
      {isError && <p>Could not load posts.</p>}

      {posts && <PostList posts={sorted} />}
    </>
  );
}
