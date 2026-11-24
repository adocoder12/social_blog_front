import { cn } from "@utils/cn";
import styles from "./Avatar.module.scss";

type AvatarProps = {
  name: string;
  className?: string;
};

export default function Avatar({ name, className }: AvatarProps) {
  // First letter of the first two words: "John Doe" → JD, "maria_dev" → M
  const initials = name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((word) => word[0])
    .join("");

  // Screen readers hear the name, not the letters
  return (
    <span role="img" aria-label={name} className={cn(styles.avatar, className)}>
      <span className={styles.initials} aria-hidden="true">
        {initials}
      </span>
    </span>
  );
}
