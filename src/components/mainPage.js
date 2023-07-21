import styles from "./body.module.css";
import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowTrendUp,
  faClock,
  faArrowDown,
  faEllipsisVertical,
} from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";

export default function MainPage(props) {
  const { list, setList } = props;
  return (
    <section className={styles.container}>
      <section className={styles.header}>
        <div className={styles.tags}>
          <Link to={"/"} className={styles.trend}>
            <FontAwesomeIcon icon={faArrowTrendUp} />
            트렌딩
          </Link>
          <Link to={"/recent"} className={styles.recentPost}>
            <FontAwesomeIcon icon={faClock} />
            최신
          </Link>
          <span className={styles.sortBy}>
            이번주 <FontAwesomeIcon icon={faArrowDown} />
          </span>
        </div>
        <button className={styles.moreInfo}>
          <FontAwesomeIcon icon={faEllipsisVertical} />
        </button>
      </section>
      <section className={styles.body}>{list}</section>
    </section>
  );
}
