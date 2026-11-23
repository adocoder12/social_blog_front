import styles from "./Hero.module.scss";

type HeroProps = {
  title: string;
  description?: string;
  maskUrl?: string;
};

export default function Hero({ title, description, maskUrl }: HeroProps) {
  return (
    <section className={styles.hero}>
      <div className={styles.mask} />
      <div className={styles.content}>
        {maskUrl && (
          <div
            className={styles.centerMask}
            style={{ backgroundImage: `url('${maskUrl}')` }}
          />
        )}
        <div className={styles.text}>
          <h1 className={styles.title}>{title}</h1>
          {description && <p className={styles.intro}>{description}</p>}
        </div>
      </div>
    </section>
  );
}
