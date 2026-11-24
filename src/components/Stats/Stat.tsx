import Eyebrow from "@components/UI/Eyebrow/Eyebrow";
import styles from "./Stat.module.scss";

type StatProps = {
  value: number;
  label: string;
};

export default function Stat({ value, label }: StatProps) {
  return (
    <>
      <p className={styles.value}>{value.toLocaleString()}</p>
      <Eyebrow className="mt-1">{label}</Eyebrow>
    </>
  );
}
