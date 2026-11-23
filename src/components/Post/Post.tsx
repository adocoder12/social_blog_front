import type { Post as PostType } from "@app-types";
import { Link } from "@tanstack/react-router";
import { formatDate, readMinutes } from "@utils/posts";
import styles from "./Post.module.scss";

type PostProps = {
  post: PostType;
};

export default function Post({ post }: PostProps) {
  return (
    <li className={styles.post}>
      <Link
        to="/posts/$postId"
        params={{ postId: String(post.id) }}
        className={styles.link}
      >
        <span className={styles.eyebrow}>{post.tags[0] ?? "general"}</span>
        <span>
          <h2 className={styles.title}>{post.title}</h2>
          <span className={styles.excerpt}>{post.content}</span>
        </span>
        <span className={styles.eyebrow}>
          <time dateTime={post.created_at}>{formatDate(post.created_at)}</time>{" "}
          · {readMinutes(post.content)} min
        </span>
      </Link>
    </li>
  );
}
