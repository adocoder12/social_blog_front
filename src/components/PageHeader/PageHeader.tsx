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
      {subtitle && <p className={styles.title}>{title}</p>}
      <h1 className={styles.subtitle}>{subtitle}</h1>
    </section>
  );
}
