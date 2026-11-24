import { useId } from "react";
import type { Comment } from "@app-types";
import CommentRow from "@components/CommentRow/CommentRow";
import styles from "./PostComments.module.scss";

type PostCommentsProps = {
  comments: Comment[];
};

// The comments come with the post (GET /posts/{id}), so loading and errors
// are already handled by the post page.
export default function PostComments({ comments }: PostCommentsProps) {
  const headingId = useId();

  return (
    <section aria-labelledby={headingId} className={styles.comments}>
      <h2 id={headingId} className={styles.heading}>
        Comments <span className={styles.count}>({comments.length})</span>
      </h2>

      {comments.length > 0 ? (
        <ul className={styles.list}>
          {comments.map((comment) => (
            <CommentRow key={comment.id} comment={comment} />
          ))}
        </ul>
      ) : (
        <p className={styles.empty}>No comments yet.</p>
      )}
    </section>
  );
}
