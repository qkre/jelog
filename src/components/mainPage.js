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
  const [orderBy, setOrderBy] = useState("createdAt");
  const [posts, setPosts] = useState([]);
  const [postElement, setPostElement] = useState([]);
  const [articles, setArticles] = useState();
  const [articleElement, setArticleElement] = useState();

  useEffect(() => {
    axios
      .get(`/api/post/all`, {
        params: {
          orderBy: orderBy,
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
          const momentAt = moment(createdAt);

          return <span className="createdAt">{momentAt.fromNow()}</span>;
        };

        return (
          <Link
            key={post.postId}
            to={`/post/${post.user.userNickName}/${post.postId}`}
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
                <div
                  className="userIcon"
                  style={{
                    backgroundColor: post.user.userIcon,
                  }}
                />
                <span className="userID">by {post.user.userNickName}</span>
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

  const changeOrderBy = (e) => {
    console.log(e.target.className);
    setOrderBy(e.target.className);
  };

  return (
    <div>
      <section className={"bodyContainer"}>
        <section className={"header"}>
          <div className={"tags"}>
            <button className="likes" onClick={changeOrderBy}>
              <FontAwesomeIcon icon={faArrowTrendUp} />
              트렌딩
            </button>
            <button className="createdAt" onClick={changeOrderBy}>
              <FontAwesomeIcon icon={faClock} />
              최신
            </button>
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
