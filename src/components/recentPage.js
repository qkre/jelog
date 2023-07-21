import { Link } from "react-router-dom";
import styles from "./body.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowDown,
  faArrowTrendUp,
  faClock,
  faEllipsisVertical,
} from "@fortawesome/free-solid-svg-icons";
export default function RecentPage(props) {
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
        </div>
        <button className={styles.moreInfo}>
          <FontAwesomeIcon icon={faEllipsisVertical} />
        </button>
      </section>
      <section className={styles.body}>{list}</section>
    </section>
  );
}
