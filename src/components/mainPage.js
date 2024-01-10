import "./body.css";
import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowTrendUp,
  faClock,
  faArrowDown,
  faEllipsisVertical,
} from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import axios from "axios";
import moment from "moment";
import "moment/locale/ko";

export default function MainPage(props) {
  const { isChanged } = props;
  const [posts, setPosts] = useState([]);
  const [postElement, setPostElement] = useState([]);
  const [articles, setArticles] = useState();
  const [articleElement, setArticleElement] = useState();

  useEffect(() => {
    axios
      .get(`/api/post/all`, {
        params: {
          orderBy: "createdAt",
        },
      })
      .then((res) => {
        setPosts(res.data);
        setArticles(res.data);
        console.log(res);
      })
      .catch((err) => console.log(err));
  }, []);

  useEffect(() => {
    try {
      const postElementList = posts.map((post) => {
        const contentElement = new DOMParser()
          .parseFromString(post.content, "text/html")
          .querySelector("div");

        var thumbnailJSX;

        try {
          const thumbnail = contentElement.querySelector("img");

          thumbnailJSX = React.createElement("div", {
            dangerouslySetInnerHTML: {
              __html: thumbnail.outerHTML,
            },
          });
        } catch (err) {
          thumbnailJSX = React.createElement("div");
        }

        let firstText;
        try {
          const childNodes = Array.from(contentElement.childNodes);
          const firstDIV = childNodes.find((item) => {
            if (item.tagName === "DIV" && item.innerText !== "") {
              return item;
            }
          });
          firstText = firstDIV.innerText;
        } catch (err) {
          console.log(err);
          firstText = "내용이 없습니다.";
        }
        const fromNow = (createdAt) => {
          console.log(createdAt);
          const momentAt = moment(createdAt);

          return <span className="createdAt">{momentAt.fromNow()}</span>;
        };

        return (
          <Link
            key={post.postId}
            to={`/post/${post.user.userId}/${post.postId}`}
            className="postBox"
          >
            <div className="innerBox">
              <div className="thumbnail">{thumbnailJSX}</div>
              <span className="title">{post.title}</span>
              <span className="content">{firstText}</span>
            </div>
            <span className="date">{fromNow(post.createdAt)}</span>
            <section className="infoSection">
              <div>
                <div className="userIcon" />
                <span className="userID">by {post.user.userEmail}</span>
              </div>
            </section>
          </Link>
        );
      });
      setPostElement(postElementList);
    } catch (err) {
      console.error(err);
    }
  }, [posts]);

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
        <section className={"body"}>{postElement}</section>
      </section>
    </div>
  );
}
