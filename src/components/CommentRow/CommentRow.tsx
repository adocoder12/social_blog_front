import type { Comment } from "@app-types";
import { formatDate } from "@utils/posts";
import styles from "./CommentRow.module.scss";

type CommentRowProps = {
  comment: Comment;
};

export default function CommentRow({ comment }: CommentRowProps) {
  return (
    <li className={styles.comment}>
      <div className={styles.meta}>
        <p className={styles.author}>
          {comment.username ?? `User #${comment.user_id}`}
        </p>
        <time className={styles.date} dateTime={comment.created_at}>
          {formatDate(comment.created_at)}
        </time>
      </div>
      <p className={styles.content}>{comment.content}</p>
    </li>
  );
}
