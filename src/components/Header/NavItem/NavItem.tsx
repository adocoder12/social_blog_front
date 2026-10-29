import { Link } from "@tanstack/react-router";
import { cn } from "@utils/cn";
import styles from "./NavItem.module.scss";

type NavItemProps = {
  name: string;
  link: string;
  setToggleMenu?: (toggle: boolean) => void;
  index: number;
  isMobile: boolean;
};

export default function NavItem({
  name,
  link,
  setToggleMenu,
  index,
  isMobile,
}: NavItemProps) {
  return (
    <Link
      to={link}
      onClick={() => setToggleMenu?.(false)}
      activeOptions={{ exact: link === "/" }}
      activeProps={{ className: styles.active }}
      inactiveProps={{ className: styles.inactive }}
      className={cn(styles.link, isMobile && styles.mobile)}
      // Mobile staggered animation
      style={{
        transitionDelay: isMobile ? `${200 + index * 70}ms` : "0ms",
      }}
    >
      {name}
      <span className={styles.underline}></span>
    </Link>
  );
}
