import type { Post } from "@app-types";
import { Link } from "@tanstack/react-router";
import { formatDate, readMinutes } from "@utils/posts";
import styles from "./PostArticle.module.scss";

type PostArticleProps = {
  post: Post;
};

export default function PostArticle({ post }: PostArticleProps) {
  // The first paragraph is the lead, the rest is the body
  const [lead, ...body] = post.content
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);

  return (
    <article className={styles.article}>
      <p className={styles.eyebrow}>
        {post.tags[0] ?? "general"} ·{" "}
        <time dateTime={post.created_at}>{formatDate(post.created_at)}</time> ·{" "}
        {readMinutes(post.content)} min
      </p>

      <h1 className={styles.title}>{post.title}</h1>

      {lead && <p className={styles.lead}>{lead}</p>}

      {body.length > 0 && (
        <div className={styles.body}>
          {body.map((para, i) => (
            <p key={i}>{para}</p>
          ))}
        </div>
      )}

      <Link to="/" className={styles.back}>
        Back to all writing
      </Link>
    </article>
  );
}
