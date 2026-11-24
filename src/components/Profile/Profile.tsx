import type { User } from "@app-types";
import Avatar from "@components/Avatar/Avatar";
import Eyebrow from "@components/UI/Eyebrow/Eyebrow";
import { formatDate } from "@utils/posts";
import styles from "./Profile.module.scss";

type ProfileProps = {
  user: User;
};

export default function Profile({ user }: ProfileProps) {
  return (
    <section className={styles.profile}>
      <Avatar name={user.username} className="size-20 text-3xl md:size-28" />
      <div>
        <Eyebrow>
          Member since{" "}
          <time dateTime={user.created_at}>{formatDate(user.created_at)}</time>
        </Eyebrow>
        <h1 className={styles.name}>@{user.username}</h1>
      </div>
    </section>
  );
}
