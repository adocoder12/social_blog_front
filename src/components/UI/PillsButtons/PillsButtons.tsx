import { cn } from "@utils/cn";
import styles from "./PillsButtons.module.scss";

type Pill = {
  label: string;
  value: string;
};

type PillsButtonsProps = {
  items: Pill[];
  value: string;
  onChange: (value: string) => void;
  className?: string;
};

export default function PillsButtons({
  items,
  value,
  onChange,
  className,
}: PillsButtonsProps) {
  return (
    <ul className={cn(styles.pills, className)}>
      {items.map((item) => {
        const isActive = item.value === value;
        return (
          <li key={item.value}>
            <button
              type="button"
              className={cn(styles.pill, isActive && styles.active)}
              aria-pressed={isActive}
              onClick={() => onChange(item.value)}
            >
              {item.label}
            </button>
          </li>
        );
      })}
    </ul>
  );
}
