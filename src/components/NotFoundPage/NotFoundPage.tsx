import { Link } from "@tanstack/react-router";
import styles from "./NotFoundPage.module.scss";

export default function NotFound() {
  return (
    <div className={styles.page}>
      <div className={styles.content}>
        {/* Decorative, so screen readers skip it */}
        <p aria-hidden="true" className={styles.code}>
          404
        </p>

        <div className={styles.text}>
          <h1 className={styles.heading}>Page not found</h1>
          <p className={styles.message}>
            The page you're looking for doesn't exist or has been moved.
          </p>
        </div>

        <Link to="/" className={styles.button}>
          Back to the feed
        </Link>
      </div>
    </div>
  );
}
