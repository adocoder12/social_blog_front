import type { ReactNode } from "react";
import { cn } from "@utils/cn";
import styles from "./Container.module.scss";

type ContainerProps = {
  children: ReactNode;
  className?: string;
};

export default function Container({ children, className }: ContainerProps) {
  return (
    <section className={cn(styles.container, className)}>{children}</section>
  );
}
