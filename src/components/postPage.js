import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./postPage.css";
import {
  faArrowDown,
  faHeart,
  faShare,
} from "@fortawesome/free-solid-svg-icons";
import { Link, useLocation } from "react-router-dom";
import Modal from "react-modal";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import moment from "moment";
import "moment/locale/ko";

export default function PostPage(props) {
  const [articleInfo, setArticleInfo] = useState();
  const [articleElement, setArticleElement] = useState();
  const location = useLocation().pathname;
  const userID = location.split("/")[2];
  const articleID = parseInt(location.split("/")[3]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const likesCountRef = useRef();

  useEffect(() => {
    axios
      .get(`/api/articles/${userID}/${articleID}`)
      .then((res) => setArticleInfo(res.data))
      .catch((err) => console.log(err));
  }, []);

  const createAt = (date) => {
    const createdAt = moment(date);
    return <span className="createdAt">{createdAt.fromNow()}</span>;
  };

  useEffect(() => {
    console.log(articleInfo);
    if (articleInfo != undefined) {
      const contentElement = new DOMParser()
        .parseFromString(articleInfo.content, "text/html")
        .querySelector("div");

      const article = (
        <div>
          <Modal
            className={"deleteModal"}
            isOpen={isModalOpen}
            // onRequestClose={closeModal}
          >
            <span className={"modalTitle"}>포스트 삭제</span>
            <span className={"modalContent"}>정말로 삭제하시겠습니까?</span>
            <div className={"modalButtons"}>
              <button className={"buttonCancel"}> 취소</button>
              <Link
                to="/"
                className={"buttonConfirm"}
                // onClick={handleButtonConfirm}
              >
                확인
              </Link>
            </div>
          </Modal>
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
                  <div className="articleFunctions hide">
                    <span className="buttonStat">통계</span>
                    <Link
                      to={`/write/${userID}/${articleID}`}
                      className="buttonMod"
                      onClick={() => {
                        document
                          .querySelector(".headerContainer")
                          .classList.add("hide");
                      }}
                    >
                      수정
                    </Link>
                    <span className="buttonDelete">삭제</span>
                  </div>
                </section>
                <section className={"tagSection"}>
                  <span className={"tag"}>Tag1</span>
                  <span className={"tag"}>Tag2</span>
                  <span className={"tag"}>Tag3</span>
                  <span className={"tag"}>Tag4</span>
                </section>
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
