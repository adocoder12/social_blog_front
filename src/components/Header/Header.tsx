import { Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import BurgerIcon from "@components/UI/icons/BurgerIcon";
import CloseIcon from "@components/UI/icons/CloseIcon";
import Navbar from "./NavBar/Navbar";
import NavItem from "./NavItem/NavItem";
import { cn } from "@utils/cn";
import styles from "./Header.module.scss";

const navLinks = [
  { name: "Feed", link: "/" },
  { name: "Profile", link: "/profile" },
];

export default function Header() {
  const [toggleMenu, setToggleMenu] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className={cn(styles.header, isScrolled && styles.scrolled)}>
      <div className={styles.inner}>
        <Link to="/" className={styles.brand}>
          Base setup react
        </Link>

        <Navbar toggleMenu={toggleMenu}>
          {navLinks.map(({ name, link }, index) => (
            <li key={link}>
              <NavItem
                name={name}
                link={link}
                setToggleMenu={setToggleMenu}
                index={index}
                isMobile={toggleMenu}
              />
            </li>
          ))}
        </Navbar>

        <div className={styles.toggleWrapper}>
          <button
            onClick={() => setToggleMenu(!toggleMenu)}
            className={cn(styles.toggle, toggleMenu && styles.open)}
            aria-label="Toggle Menu"
          >
            {!toggleMenu ? (
              <BurgerIcon className={styles.icon} />
            ) : (
              <CloseIcon className={styles.icon} />
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
