import type { CSSProperties } from "react";
import { Link } from "@tanstack/react-router";

import { FaEnvelope, FaGithub, FaLinkedin } from "react-icons/fa";
import styles from "./Footer.module.scss";

const EMAIL = "adonay.jadal@gmail.com";
const YEAR = new Date().getFullYear();

const socialLinks = [
  {
    name: "GitHub",
    link: "https://github.com/adocoder12",
    hoverColor: "#ffffff", // GitHub's #333 would be invisible on the dark background
    icon: <FaGithub size={28} />,
  },
  {
    name: "LinkedIn",
    link: "https://www.linkedin.com/in/adonay-dagosto/",
    hoverColor: "#0077b5",
    icon: <FaLinkedin size={28} />,
  },
  {
    name: "Email",
    link: `mailto:${EMAIL}`,
    hoverColor: "var(--color-decorator)",
    icon: <FaEnvelope size={28} />,
  },
];

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.top}>
          <div className={styles.column}>
            <Link to="/" className={styles.brand}>
              Go.Blog
            </Link>
            <p className={styles.quote}>
              “Talk is cheap. Show me the code.”
              <br />— Linus Torvalds
            </p>
          </div>

          {/* 
          <div className={styles.column}>
            <p className={styles.heading}>Contact</p>
            <a href={`mailto:${EMAIL}`} className={styles.email}>
              <FaEnvelope size={14} className={styles.emailIcon} />
              {EMAIL}
            </a>
            </div> 
          */}
        </div>

        <hr className={styles.divider} />

        <div className={styles.bottom}>
          <p className={styles.copyright}>
            &copy; {YEAR} Adonay D'Agosto. All rights reserved.
          </p>

          {/* Social links */}
          <div className={styles.social}>
            {socialLinks.map(({ name, link, icon, hoverColor }) => (
              <a
                key={name}
                href={link}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={name}
                style={{ "--hover-color": hoverColor } as CSSProperties}
                className={styles.socialLink}
              >
                {icon}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
