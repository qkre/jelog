import {
  faArrowDown,
  faArrowTrendUp,
  faClock,
  faEllipsisVertical,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import moment from "moment";
import "moment/locale/ko";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Header from "./header";
import "./mainPage.css";

export default function MainPage(props) {
  const { isLogin, setIsLogin, loginModalShow, setLoginModalShow } = props;
  const [count, setCount] = useState(0);
  const [orderBy, setOrderBy] = useState("createdAt");
  const [postElement, setPostElement] = useState([]);

  let timeout;

  window.addEventListener("scroll", () => {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      const scrollable =
        document.documentElement.scrollHeight - window.innerHeight - 100;
      const scrolled = window.scrollY;
      console.log(scrolled);
      if (scrolled > scrollable) {
        // 화면의 맨 끝까지 스크롤됨
        console.log("맨 끝까지 스크롤됨");
        setCount(count + 1);
      }
    }, 200); // 200ms 딜레이
  });

  useEffect(() => {
    console.log("API 요청 ");
    axios
      .get(`/api/public/post/all`, {
        params: {
          orderBy: orderBy,
          page: count,
        },
      })
      .then((res) => {
        makePostElement(res.data);
      })
      .catch((err) => console.log(err));
  }, [count, orderBy]);

  const makePostElement = (postDatas) => {
    console.log(postDatas);

    const newPostElement = postDatas.map((post) => {
      const key = post.postId;
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
          key={key}
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

    setPostElement([...postElement, ...newPostElement]);
  };

  const changeOrderBy = (e) => {
    console.log(e.target.className);
    setOrderBy(e.target.className);
  };

  return (
    <div className="mainPage">
      <section className="header">
        <Header
          isLogin={isLogin}
          setIsLogin={setIsLogin}
          loginModalShow={loginModalShow}
          setLoginModalShow={setLoginModalShow}
        />
        <section className={"function"}>
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
      </section>
      <section className={"body"}>{postElement}</section>
    </div>
  );
}
