import React from "react";
import styles from "./header.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSun,
  faMagnifyingGlass,
  faArrowDown,
} from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";

export default function Header(props) {
  return (
    <section className={styles.header}>
      <div className={styles.logos}>
        <Link className={styles.logoImage}>J</Link>
        <Link to={"/"} className={styles.logoString}>
          jelog
        </Link>
      </div>
      <div className={styles.buttons}>
        <button className={styles.dayNight}>
          <FontAwesomeIcon icon={faSun} />
        </button>
        <button className={styles.search}>
          <FontAwesomeIcon icon={faMagnifyingGlass} />
        </button>
        <Link to="/write" className={styles.newPost}>
          새 글 작성
        </Link>
        <button className={styles.userIcon}></button>
        <button className={styles.moreInfo}>
          <FontAwesomeIcon icon={faArrowDown} />
        </button>
      </div>
    </section>
  );
}
