// Mirrors the Go Comment DTO. Field names follow the JSON the API sends.
// TODO: replace with the real fields of the Go Comment struct
export type Comment = {
  id: number;
  post_id: number;
  user_id: number;
  content: string;
  created_at: string; // ISO date, Go time.Time
};
