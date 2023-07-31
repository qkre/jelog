import { Link } from "react-router-dom";
import "./body.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowTrendUp,
  faClock,
  faEllipsisVertical,
} from "@fortawesome/free-solid-svg-icons";

export default function RecentPage(props) {
  const { postList } = props;
  return (
    <div>
      <section className={"bodyContainer"}>
        <section className={"header"}>
          <div className={"tags"}>
            <Link to={"/"} className={"trend"}>
              <FontAwesomeIcon icon={faArrowTrendUp} />
              트렌딩
            </Link>
            <Link to={"/recent"} className={"recentPost"}>
              <FontAwesomeIcon icon={faClock} />
              최신
            </Link>
          </div>
          <button className={"moreInfo"}>
            <FontAwesomeIcon icon={faEllipsisVertical} />
          </button>
        </section>
        <section className={"body"}>{postList}</section>
      </section>
    </div>
  );
}
