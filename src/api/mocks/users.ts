import type { User } from "@app-types";

// Mock data until the Go API is connected. Ids match the user_id values in mocks/posts.ts.
// Emails use example.com, a domain reserved for examples.
export const mockUsers: User[] = [
  {
    id: 1,
    username: "adonay",
    email: "adonay@example.com",
    created_at: "2026-10-01T09:00:00Z",
    updated_at: "2026-10-01T09:00:00Z",
    is_active: true,
  },
  {
    id: 2,
    username: "maria_dev",
    email: "maria@example.com",
    created_at: "2026-10-03T14:20:00Z",
    updated_at: "2026-11-02T08:15:00Z",
    is_active: true,
  },
  {
    id: 3,
    username: "gopher_luca",
    email: "luca@example.com",
    created_at: "2026-10-10T18:45:00Z",
    updated_at: "2026-10-10T18:45:00Z",
    is_active: true,
  },
  {
    id: 4,
    username: "sam.writes",
    email: "sam@example.com",
    created_at: "2026-10-21T11:05:00Z",
    updated_at: "2026-11-15T19:30:00Z",
    is_active: true,
  },
  {
    id: 5,
    username: "old_account",
    email: "old@example.com",
    created_at: "2026-09-12T07:00:00Z",
    updated_at: "2026-11-01T10:00:00Z",
    is_active: false,
  },
];
