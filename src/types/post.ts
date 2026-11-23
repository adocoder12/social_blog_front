import type { Comment } from "./comment";

// Mirrors the Go Post DTO. Field names follow the JSON the API sends.
export type Post = {
  id: number;
  title: string;
  content: string;
  user_id: number;
  tags: string[];
  comments: Comment[];
  version: number;
  created_at: string; // ISO date, Go time.Time
  updated_at: string;
};
