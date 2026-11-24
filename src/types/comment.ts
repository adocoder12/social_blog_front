// Mirrors the Go ResponseComment DTO (internal/dto/comment.go).
// Field names follow the JSON the API sends.
export type Comment = {
  id: number;
  post_id: number;
  user_id: number;
  username?: string; // omitempty: missing when the user wasn't loaded
  content: string;
  created_at: string; // ISO date, Go time.Time
};
