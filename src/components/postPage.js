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
import Modal from "react-modal";
import "moment/locale/ko";

export default function PostPage(props) {
  const serverLocation = "http://localhost:8080";

  const userInfo = JSON.parse(sessionStorage.getItem("userInfo"));

  const { isLogin } = props;
  const [postInfo, setPostInfo] = useState(null);
  const [postElement, setPostElement] = useState();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const location = useLocation().pathname;
  const userNickName = location.split("/")[2];
  const postId = location.split("/")[3];
  const likesCountRef = useRef();

  const createAt = (date) => {
    const createdAt = moment(date);
    return <span className="createdAt">{createdAt.fromNow()}</span>;
  };

  const showModal = () => {
    setIsDeleteModalOpen(true);
  };

  const deleteModalFunctions = {
    closeModal: () => {
      setIsDeleteModalOpen(false);
    },
    onClickButtonConfirm: () => {
      deleteModalFunctions.closeModal();
      axios
        .delete(`/api/post/delete/${userNickName}/${postId}`)
        .then((res) => {
          console.log(res);
        })
        .catch((err) => console.error(err));
    },
  };

  useEffect(() => {
    axios
      .get(`/api/post/read/${userNickName}/${postId}`)
      .then((res) => {
        console.log(res.data);
        setPostInfo(res.data);
      })
      .catch((err) => console.error(err));
  }, []);

  useEffect(() => {
    if (postInfo != null) {
      const contentElement = new DOMParser()
        .parseFromString(postInfo.content, "text/html")
        .querySelector("div");

      const tagElement = postInfo.tags.map((tag) => {
        return <div className="tag">{tag}</div>;
      });

      const post = (
        <div>
          <section className="postContainer">
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
                <span className="title">{postInfo.title}</span>
                <section className="postInfoSection">
                  <div className="publishInfo">
                    <span className="userNickName">
                      {postInfo.user.userNickName}
                    </span>
                    {createAt(postInfo.createAt)}
                  </div>
                  {isLogin && userNickName === userInfo.userNickName && (
                    <div className="postFunctions">
                      <span className="buttonStat">통계</span>
                      <Link
                        to={`/write/${userNickName}/${postId}`}
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
                  )}
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
      setPostElement(post);
    }
  }, [postInfo]);

  return (
    <div>
      <Modal
        className={"deleteModal"}
        isOpen={isDeleteModalOpen}
        onRequestClose={deleteModalFunctions.closeModal}
      >
        <span className={"modalTitle"}>포스트 삭제</span>
        <span className={"modalContent"}>정말로 삭제하시겠습니까?</span>
        <div className={"modalButtons"}>
          <button
            className={"buttonCancel"}
            onClick={deleteModalFunctions.closeModal}
          >
            {" "}
            취소
          </button>
          <Link
            to={"/"}
            className={"buttonConfirm"}
            onClick={deleteModalFunctions.onClickButtonConfirm}
          >
            확인
          </Link>
        </div>
      </Modal>
      {postElement}
    </div>
  );
}
