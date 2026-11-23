import styles from "./PageHeader.module.scss";

type PageHeaderProps = {
  title: string;
  subtitle?: string;
  imageUrl?: string;
};

export default function PageHeader({
  title,
  subtitle,
  imageUrl,
}: PageHeaderProps) {
  return (
    <section
      className={styles.pageHeader}
      style={imageUrl ? { backgroundImage: `url('${imageUrl}')` } : undefined}
    >
      <div className={styles.mask} />
      <h1 className={styles.title}>{title}</h1>
      {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
    </section>
  );
}
