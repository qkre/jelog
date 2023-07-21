import React from "react";
import styles from "./header.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSun,
  faMagnifyingGlass,
  faArrowDown,
} from "@fortawesome/free-solid-svg-icons";
import { Link, useLocation } from "react-router-dom";

export default function Header(props) {
  const { addTrendPost, addRecentPost } = props;
  const location = useLocation();

  const addPost = location.pathname === "/" ? addTrendPost : addRecentPost;

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
        <button className={styles.newPost} onClick={addPost}>
          새 글 작성
        </button>
        <button className={styles.userIcon}></button>
        <button className={styles.moreInfo}>
          <FontAwesomeIcon icon={faArrowDown} />
        </button>
      </div>
    </section>
  );
}
