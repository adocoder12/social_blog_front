import type { Post as PostType } from "@app-types";
import Post from "@components/Post/Post";
import Eyebrow from "@components/UI/Eyebrow/Eyebrow";
import styles from "./PostList.module.scss";

type PostListProps = {
  title?: string;
  posts: PostType[];
};

export default function PostList({ title, posts }: PostListProps) {
  if (posts.length === 0) return <p>No posts yet.</p>;

  return (
    <section className={styles.postList}>
      {title && <Eyebrow as="span">{title}</Eyebrow>}
      <ul className={styles.list}>
        {posts.map((post) => (
          <Post key={post.id} post={post} />
        ))}
      </ul>
    </section>
  );
}
