import type { Post as PostType } from "@app-types";
import Post from "@components/Post/Post";
import styles from "./PostList.module.scss";

type PostListProps = {
  posts: PostType[];
};

export default function PostList({ posts }: PostListProps) {
  if (posts.length === 0) return <p>No posts yet.</p>;

  return (
    <ul className={styles.list}>
      {posts.map((post) => (
        <Post key={post.id} post={post} />
      ))}
    </ul>
  );
}
