import type { Post } from "@app-types";
import { mockUsers } from "./users";

// Mock data until the Go API is connected
const posts: Post[] = [
  {
    id: 1,
    title: "Why I switched my side projects to Go",
    content:
      "After years of Node on the backend I gave Go a real try. The standard library, the tooling and the single binary deploys won me over faster than I expected.",
    user_id: 1,
    tags: ["go", "backend"],
    comments: [
      {
        id: 1,
        post_id: 1,
        user_id: 2,
        content: "Same story here.",
        created_at: "2026-11-20T10:12:00Z",
      },
      {
        id: 2,
        post_id: 1,
        user_id: 3,
        content: "How do you handle migrations?",
        created_at: "2026-11-20T12:40:00Z",
      },
      {
        id: 3,
        post_id: 1,
        user_id: 4,
        content: "Great read.",
        created_at: "2026-11-21T08:05:00Z",
      },
    ],
    version: 1,
    created_at: "2026-11-20T09:00:00Z",
    updated_at: "2026-11-20T09:00:00Z",
  },
  {
    id: 2,
    title: "A calm morning routine for developers",
    content:
      "No phone for the first hour, a short walk and one clear goal for the day. Small habits that made my work feel less rushed.",
    user_id: 2,
    tags: ["life", "habits"],
    comments: [
      {
        id: 4,
        post_id: 2,
        user_id: 1,
        content: "The walk part is underrated.",
        created_at: "2026-11-19T07:30:00Z",
      },
    ],
    version: 1,
    created_at: "2026-11-18T06:45:00Z",
    updated_at: "2026-11-18T06:45:00Z",
  },
  {
    id: 3,
    title: "TanStack Query in five minutes",
    content:
      "Server state is not UI state. Once that clicked, caching, refetching and loading states stopped being something I wrote by hand.",
    user_id: 3,
    tags: ["react", "frontend"],
    comments: [
      {
        id: 5,
        post_id: 3,
        user_id: 2,
        content:
          "We switched to errgroup recently. Having cancellation tied to the whole group removed a lot of cleanup code.",
        created_at: "2026-11-22T14:00:00Z",
      },
      {
        id: 6,
        post_id: 3,
        user_id: 4,
        content: "What about mutations?",
        created_at: "2026-11-22T15:20:00Z",
      },
      {
        id: 7,
        post_id: 3,
        user_id: 1,
        content: "Bookmarked.",
        created_at: "2026-11-22T18:45:00Z",
      },
      {
        id: 8,
        post_id: 3,
        user_id: 5,
        content: "Clear and short, thanks.",
        created_at: "2026-11-23T09:10:00Z",
      },
    ],
    version: 2,
    created_at: "2026-11-22T11:00:00Z",
    updated_at: "2026-11-22T13:30:00Z",
  },
  {
    id: 4,
    title: "Notes from a weekend without screens",
    content:
      "I left the laptop closed from Friday night to Monday morning. Here is what I noticed, what I missed and what I did not miss at all.",
    user_id: 4,
    tags: ["life"],
    comments: [],
    version: 1,
    created_at: "2026-11-16T17:20:00Z",
    updated_at: "2026-11-16T17:20:00Z",
  },
  {
    id: 5,
    title: "Designing a small, readable API in Go",
    content:
      "Handlers that do one thing, errors that tell you what went wrong, and DTOs that never leak database details. A few rules I keep coming back to.",
    user_id: 1,
    tags: ["go", "api", "backend"],
    comments: [
      {
        id: 9,
        post_id: 5,
        user_id: 3,
        content:
          "We switched to errgroup recently. Having cancellation tied to the whole group removed a lot of cleanup code.",
        created_at: "2026-11-21T20:00:00Z",
      },
      {
        id: 10,
        post_id: 5,
        user_id: 2,
        content: "More posts like this please.",
        created_at: "2026-11-22T07:15:00Z",
      },
    ],
    version: 1,
    created_at: "2026-11-21T16:00:00Z",
    updated_at: "2026-11-21T16:00:00Z",
  },
];

// The Go API joins the author's username onto each comment, so the mock does too
export const mockPosts: Post[] = posts.map((post) => ({
  ...post,
  comments: post.comments.map((comment) => ({
    ...comment,
    username: mockUsers.find((user) => user.id === comment.user_id)?.username,
  })),
}));
