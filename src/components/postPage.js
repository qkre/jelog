import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./postPage.css";
import {
  faArrowDown,
  faHeart,
  faShare,
} from "@fortawesome/free-solid-svg-icons";
import { Link, useLocation } from "react-router-dom";

import { useEffect, useRef, useState } from "react";
import axios from "axios";
import moment from "moment";
import "moment/locale/ko";

export default function PostPage(props) {
  const serverLocation = "http://localhost:8080";

  const { USER, setIsDeleteModalOpen, setDeletePostInfo } = props;
  const [articleInfo, setArticleInfo] = useState();
  const [articleElement, setArticleElement] = useState();
  const location = useLocation().pathname;
  const publisher = location.split("/")[2];
  const articleID = parseInt(location.split("/")[3]);
  const likesCountRef = useRef();

  const createAt = (date) => {
    const createdAt = moment(date);
    return <span className="createdAt">{createdAt.fromNow()}</span>;
  };

  const showModal = () => {
    setIsDeleteModalOpen(true);
  };

  useEffect(() => {
    axios
      .get(`${serverLocation}/api/articles/${publisher}/${articleID}`)
      .then((res) => setArticleInfo(res.data))
      .catch((err) => console.log(err));
    setDeletePostInfo({
      publisher,
      articleID,
    });
  }, []);

  useEffect(() => {
    if (articleInfo !== undefined) {
      let articleFunctions = "articleFunctions hide";

      if (USER !== undefined && articleInfo.publisher === USER.userID) {
        articleFunctions = articleFunctions.split(" ")[0];
      }

      const contentElement = new DOMParser()
        .parseFromString(articleInfo.content, "text/html")
        .querySelector("div");

      const tagElement = articleInfo.tags.split(",").map((tag) => {
        return <div className="tag">{tag}</div>;
      });

      const article = (
        <div>
          <section className="articleContainer">
            <section className="sideBarSection">
              <div className="sideBarMenu">
                <button className="buttonLike">
                  <FontAwesomeIcon icon={faHeart} />
                </button>
                <span ref={likesCountRef} className="likesCount">
                  1
                </span>
                <button className="buttonShare">
                  <FontAwesomeIcon icon={faShare} />
                </button>
              </div>
            </section>
            <section className="mainSection">
              <section className="headerSection">
                <span className="title">{articleInfo.title}</span>
                <section className="articleInfoSection">
                  <div className="publishInfo">
                    <span className="publisher">{articleInfo.publisher}</span>
                    {createAt(articleInfo.createAt)}
                  </div>
                  <div className={articleFunctions}>
                    <span className="buttonStat">통계</span>
                    <Link
                      to={`/write/${publisher}/${articleID}`}
                      className="buttonMod"
                      onClick={() => {
                        document
                          .querySelector(".headerContainer")
                          .classList.add("hide");
                      }}
                    >
                      수정
                    </Link>
                    <span className="buttonDelete" onClick={showModal}>
                      삭제
                    </span>
                  </div>
                </section>
                <section className={"tagSection"}>{tagElement}</section>
              </section>
              <section className={"seriesSection"}>
                <span className={"seriesTitle"}>Series Title</span>
                <div className={"indicators"}>
                  <button className={"buttonShowList"}>
                    <FontAwesomeIcon icon={faArrowDown} />
                    {" 목록보기"}
                  </button>
                  <div className={"pageIndicators"}>
                    <span className={"pages"}>1 / 1</span>
                    <button className={"buttonBack"}>{"<"}</button>
                    <button className={"buttonForward"}>{">"}</button>
                  </div>
                </div>
              </section>
              <section
                dangerouslySetInnerHTML={{ __html: contentElement.outerHTML }}
              />
            </section>
            <section className={"summarySection"}>
              <div className={"summaryIndexes"}>
                <span>Index1</span>
                <span>Index2</span>
                <span>Index3</span>
              </div>
            </section>
          </section>
        </div>
      );

      setArticleElement(article);
    }
  }, [articleInfo]);

  return <div>{articleElement}</div>;
}
