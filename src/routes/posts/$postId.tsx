import { createFileRoute } from "@tanstack/react-router";
import PostArticle from "@components/PostArticle/PostArticle";
import { postQueryOptions, usePost } from "@hooks/usePosts";
import { excerpt } from "@utils/posts";

export const Route = createFileRoute("/posts/$postId")({
  // Load the post before the page renders, so head() can use it.
  // staleTime "static" = use the cached post if there is one, otherwise fetch it
  loader: ({ context, params }) =>
    context.queryClient.query({
      ...postQueryOptions(Number(params.postId)),
      staleTime: "static",
    }),
  head: ({ loaderData: post }) => {
    const title = post ? `${post.title} — Social Blog` : "Post — Social Blog";
    const description = post ? excerpt(post.content) : "A post on Social Blog.";
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: post?.title ?? "Social Blog post" },
        { property: "og:description", content: description },
        { property: "og:type", content: "article" },
      ],
    };
  },
  errorComponent: () => <p>Could not load this post.</p>,
  component: PostPage,
});

function PostPage() {
  const { postId } = Route.useParams();
  // Already in the cache thanks to the loader
  const { data: post } = usePost(Number(postId));

  if (!post) return null;

  return <PostArticle post={post} />;
}
