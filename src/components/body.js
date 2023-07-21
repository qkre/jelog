import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowTrendUp,
  faClock,
  faArrowDown,
  faEllipsisVertical,
} from "@fortawesome/free-solid-svg-icons";
import styles from "./body.module.css";

export default function Body() {
  return (
    <section className={styles.container}>
      <section className={styles.header}>
        <div className={styles.tags}>
          <button className={styles.trend}>
            <FontAwesomeIcon icon={faArrowTrendUp} />
            트렌딩
          </button>
          <button className={styles.recentPost}>
            <FontAwesomeIcon icon={faClock} />
            최신
          </button>
          <button className={styles.sortBy}>
            이번주 <FontAwesomeIcon icon={faArrowDown} />
          </button>
        </div>
        <button className={styles.moreInfo}>
          <FontAwesomeIcon icon={faEllipsisVertical} />
        </button>
      </section>
      <section className={styles.body}>
        <div className={styles.postBox}></div>
        <div className={styles.postBox}></div>
        <div className={styles.postBox}></div>
        <div className={styles.postBox}></div>
        <div className={styles.postBox}></div>
        <div className={styles.postBox}></div>
        <div className={styles.postBox}></div>
        <div className={styles.postBox}></div>
        <div className={styles.postBox}></div>
        <div className={styles.postBox}></div>
        <div className={styles.postBox}></div>
        <div className={styles.postBox}></div>
      </section>
    </section>
  );
}
