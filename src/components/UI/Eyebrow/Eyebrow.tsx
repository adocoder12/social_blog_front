import type { ReactNode } from "react";
import { cn } from "@utils/cn";
import styles from "./Eyebrow.module.scss";

type EyebrowProps = {
  children: ReactNode;
  // span inside links and other inline places, p when it stands on its own
  as?: "p" | "span";
  className?: string;
};

// Small uppercase label: tags, dates, @username
export default function Eyebrow({
  children,
  as: Tag = "p",
  className,
}: EyebrowProps) {
  return <Tag className={cn(styles.eyebrow, className)}>{children}</Tag>;
}
