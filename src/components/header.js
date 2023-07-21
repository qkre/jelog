import React from "react";
import styles from "./header.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import {
  faSun,
  faMagnifyingGlass,
  faArrowDown,
} from "@fortawesome/free-solid-svg-icons";
export default function Header() {
  return (
    <section className={styles.header}>
      <div className={styles.logos}>
        <image className={styles.logoImage}>J</image>
        <button className={styles.logoString}>jelog</button>
      </div>
      <div className={styles.buttons}>
        <button className={styles.dayNight}>
          <FontAwesomeIcon icon={faSun} />
        </button>
        <button className={styles.search}>
          <FontAwesomeIcon icon={faMagnifyingGlass} />
        </button>
        <button className={styles.newPost}>새 글 작성</button>
        <button className={styles.userIcon}></button>
        <button className={styles.moreInfo}>
          <FontAwesomeIcon icon={faArrowDown} />
        </button>
      </div>
    </section>
  );
}
