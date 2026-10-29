import type { ReactNode } from "react";
import { cn } from "@utils/cn";
import styles from "./Navbar.module.scss";

type NavbarProps = {
  toggleMenu: boolean;
  children: ReactNode;
  className?: string;
};

export default function Navbar({
  toggleMenu,
  children,
  className,
}: NavbarProps) {
  return (
    <nav className={cn(styles.nav, toggleMenu && styles.open, className)}>
      <ul className={styles.list}>{children}</ul>
    </nav>
  );
}
