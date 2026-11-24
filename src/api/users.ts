import type { User } from "@app-types";
import { mockUsers } from "./mocks/users";

// Mock for now. When the Go API is ready, replace the body with a call to
// GET /users/{id} through api/client.ts and delete mocks/users.ts.
const fakeDelay = () => new Promise((resolve) => setTimeout(resolve, 300));

// Get a single user by ID. Throws an error if not found.
export async function getUser(id: number): Promise<User> {
  await fakeDelay();
  const user = mockUsers.find((u) => u.id === id);
  if (!user) throw new Error("User not found");
  return user;
}
