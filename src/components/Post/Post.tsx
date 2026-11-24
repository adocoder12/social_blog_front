import type { Post as PostType } from "@app-types";
import CommentsCircle from "@components/UI/CommentsCircle/CommentsCircle";
import Eyebrow from "@components/UI/Eyebrow/Eyebrow";
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
        <Eyebrow as="span">{post.tags[0] ?? "general"}</Eyebrow>
        <span>
          <h2 className={styles.title}>{post.title}</h2>
          <span className={styles.excerpt}>{post.content}</span>
        </span>
        <div className="flex flex-col gap-3 md:items-end">
          <Eyebrow as="span">
            <time dateTime={post.created_at}>
              {formatDate(post.created_at)}
            </time>{" "}
            · {readMinutes(post.content)} min
          </Eyebrow>
          <CommentsCircle count={post.comments.length} />
        </div>
      </Link>
    </li>
  );
}
