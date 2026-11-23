import type { Post } from "@app-types";
import { mockPosts } from "./mocks/posts";

// Mock for now. When the Go API is ready, replace the bodies with calls
// through api/client.ts and delete mocks/.
const fakeDelay = () => new Promise((resolve) => setTimeout(resolve, 300));

// Get all posts. Returns an empty array if none exist.
export async function getPosts(): Promise<Post[]> {
  await fakeDelay();
  return mockPosts;
}

// Get a single post by ID. Throws an error if not found.
export async function getPost(id: number): Promise<Post> {
  await fakeDelay();
  const post = mockPosts.find((p) => p.id === id);
  if (!post) throw new Error("Post not found");
  return post;
}
