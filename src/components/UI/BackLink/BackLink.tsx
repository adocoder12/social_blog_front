import type { ReactNode } from "react";
import { Link, type LinkProps } from "@tanstack/react-router";
import { cn } from "@utils/cn";
import styles from "./BackLink.module.scss";

type BackLinkProps = {
  to: LinkProps["to"];
  children: ReactNode;
  className?: string;
};

// Underlined uppercase link with a ← that nudges left on hover
export default function BackLink({ to, children, className }: BackLinkProps) {
  return (
    <Link to={to} className={cn(styles.back, className)}>
      {children}
    </Link>
  );
}
