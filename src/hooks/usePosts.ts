import { queryOptions, useQuery } from "@tanstack/react-query";
import { getPost, getPosts } from "@api/posts";

export const postKeys = {
  all: ["posts"] as const,
  list: () => [...postKeys.all, "list"] as const,
  detail: (id: number) => [...postKeys.all, "detail", id] as const,
};

// Shared by usePost and the post route's loader, so both use the same cache entry
export const postQueryOptions = (id: number) =>
  queryOptions({
    queryKey: postKeys.detail(id),
    queryFn: () => getPost(id),
  });

export function usePosts() {
  return useQuery({
    queryKey: postKeys.list(),
    queryFn: getPosts,
  });
}

export function usePost(id: number) {
  return useQuery(postQueryOptions(id));
}
