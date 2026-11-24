import { queryOptions, useQuery } from "@tanstack/react-query";
import { getUser } from "@api/users";

export const userKeys = {
  all: ["users"] as const,
  detail: (id: number) => [...userKeys.all, "detail", id] as const,
};

// Shared by useUser and route loaders, so both use the same cache entry
export const userQueryOptions = (id: number) =>
  queryOptions({
    queryKey: userKeys.detail(id),
    queryFn: () => getUser(id),
  });

// Get a single user by id from the server and cache it
export function useUser(id: number) {
  return useQuery(userQueryOptions(id));
}
