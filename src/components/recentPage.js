import { Link } from "react-router-dom";
import styles from "./body.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowTrendUp,
  faClock,
  faEllipsisVertical,
} from "@fortawesome/free-solid-svg-icons";
import Header from "./header";
export default function RecentPage(props) {
  const { postList, setPostList, isLogin, setIsLogin, userID, setUserID } =
    props;
  return (
    <div>
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
        <section className={styles.body}>{postList}</section>
      </section>
    </div>
  );
}
