import { cn } from "@utils/cn";
import CommentIcon from "@components/UI/icons/CommentIcon";
import styles from "./CommentsCircle.module.scss";

type CommentsCircleProps = {
  count: number;
  className?: string;
};

export default function CommentsCircle({
  count,
  className,
}: CommentsCircleProps) {
  return (
    <span className={cn(styles.count, className)}>
      <CommentIcon className={styles.icon} />
      {count} {count === 1 ? "comment" : "comments"}
    </span>
  );
}
