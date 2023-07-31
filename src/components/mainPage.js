import "./body.css";
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowTrendUp,
  faClock,
  faClose,
  faArrowDown,
  faEllipsisVertical,
} from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";

export default function MainPage(props) {
  const { postList, setPostList, isLogin, setIsLogin, userID, setUserID } =
    props;
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
            <span className={"sortBy"}>
              이번주 <FontAwesomeIcon icon={faArrowDown} />
            </span>
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
