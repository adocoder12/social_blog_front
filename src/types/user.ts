// Mirrors the Go ResponseUser DTO (internal/dto/user.go).
// Field names follow the JSON the API sends.
export type User = {
  id: number;
  username: string;
  email: string;
  created_at: string; // ISO date, Go time.Time
  updated_at: string;
  is_active: boolean;
};
