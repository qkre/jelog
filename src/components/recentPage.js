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

export default function RecentPage() {
  const serverLocation = "http://localhost:8080";

  const [articles, setArticles] = useState();
  const [articleElement, setArticleElement] = useState();

  useEffect(() => {
    axios
      .get(`${serverLocation}/api/articles`)
      .then((res) => {
        const sortedArticles = res.data;
        sortedArticles.sort((a, b) => {
          if (a.id > b.id) return -1;
          else return 1;
        });
        setArticles(sortedArticles);
      })
      .catch((err) => console.log(err));
  }, []);
  useEffect(() => {
    console.log(articles);
    if (articles != undefined) {
      const articleList = articles.map((article) => {
        const contentElement = new DOMParser()
          .parseFromString(article.content, "text/html")
          .querySelector("div");

        let thumbnailJSX;

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

        const firstText = Array.from(contentElement.childNodes).find(
          (item) => item.nodeName === "#text"
        ).textContent;

        const createAt = (date) => {
          const createdAt = moment(date);
          return <span className="createdAt">{createdAt.fromNow()}</span>;
        };

        return (
          <Link
            to={`/articles/${article.publisher}/${article.id}`}
            className="articleBox"
          >
            <div className="innerBox">
              <div className="thumbnail">{thumbnailJSX}</div>
              <span className="title">{article.title}</span>
              <span className="content">{firstText}</span>
            </div>
            <span className="date">{createAt(article.createAt)}</span>
            <section className="infoSection">
              <div>
                <div className="userIcon" />
                <span className="userID">by {article.publisher}</span>
              </div>
            </section>
          </Link>
        );
      });
      setArticleElement(articleList);
    }
  }, [articles]);
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
        <section className={"body"}>{articleElement}</section>
      </section>
    </div>
  );
}
