import { queryOptions, useQuery } from "@tanstack/react-query";
import { getPost, getPosts } from "@api/posts";

export const postKeys = {
  all: ["posts"] as const,
  list: () => [...postKeys.all, "list"] as const,
  detail: (id: number) => [...postKeys.all, "detail", id] as const,
};

// this  is a helper function to create the query options for a single post, given its id
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

// get a single post by id from the server and cache it in the react-query cache
export function usePost(id: number) {
  return useQuery(postQueryOptions(id));
}
