import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./postPage.css";
import {
  faArrowLeft,
  faArrowRight,
  faArrowDown,
  faHeart,
  faShare,
} from "@fortawesome/free-solid-svg-icons";
import { Link, useLocation, useNavigate } from "react-router-dom";

import { useEffect, useRef, useState } from "react";
import axios from "axios";
import moment from "moment";
import Modal from "react-modal";
import "moment/locale/ko";

export default function PostPage(props) {
  const userInfo = JSON.parse(sessionStorage.getItem("userInfo"));
  const token = sessionStorage.getItem("token");

  const navigator = useNavigate();

  const { isLogin, setLocation } = props;
  const [recentPosts, setRecentPosts] = useState(null);
  const [recentElement, setRecentElement] = useState();
  const [postInfo, setPostInfo] = useState(null);
  const [postElement, setPostElement] = useState();
  const [isLiked, setIsLiked] = useState();
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
  const onClickLikeButton = () => {
    if (isLogin) {
      axios
        .post(
          "/api/post/like/add",
          {
            postId: postInfo.postId,
            userId: userInfo.userId,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        .then((res) => {
          console.log(res.data);
          setIsLiked(true);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  const onClickUnlikeButton = () => {
    if (isLogin) {
      axios
        .delete("/api/post/like/delete", {
          data: {
            postId: postInfo.postId,
            userId: userInfo.userId,
          },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => {
          console.log(res.data);
          setIsLiked(false);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  const isAlreadyLiked = (data) => {
    if (data.postLike.find((like) => like.userId === userInfo.userId)) {
      return true;
    }
    return false;
  };

  const onClickNextPost = () => {
    setLocation(`/post/${userNickName}/${recentPosts.next.postId}`);
  };

  const onClickPrevPost = () => {
    setLocation(`/post/${userNickName}/${recentPosts.prev.postId}`);
  };

  useEffect(() => {
    if (postId != null && userNickName != null) {
      axios
        .get(`/api/post/read/${userNickName}/${postId}`)
        .then((res) => {
          console.log(res.data);
          const result = isAlreadyLiked(res.data);
          setIsLiked(result);
        })
        .catch((err) => console.error(err));
    }
  }, []);

  useEffect(() => {
    if (postId != null && userNickName != null) {
      axios
        .get(`/api/post/read/${userNickName}/${postId}`)
        .then((res) => {
          setPostInfo(res.data);
        })
        .catch((err) => console.error(err));
    }
  }, [isLiked]);

  useEffect(() => {
    if (postInfo != null) {
      axios
        .get("/api/post/recent", {
          params: { userId: postInfo.user.userId, postId: postInfo.postId },
        })
        .then((res) => {
          console.log(res.data);
          setRecentPosts(res.data);
        })
        .catch((err) => console.error(err));

      const contentElement = new DOMParser()
        .parseFromString(postInfo.content, "text/html")
        .querySelector("div");

      const tagElement = postInfo.tags.map((tag) => {
        return <div className="tag">{tag}</div>;
      });
      const post = (
        <section className="postSection">
          <section className="sideBarSection">
            <div className="sideBarMenu">
              {isLiked ? (
                <button className="buttonUnlike" onClick={onClickUnlikeButton}>
                  <FontAwesomeIcon icon={faHeart} />
                </button>
              ) : (
                <button className="buttonLike" onClick={onClickLikeButton}>
                  <FontAwesomeIcon icon={faHeart} />
                </button>
              )}
              <span ref={likesCountRef} className="likesCount">
                {postInfo.postLike.length}
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
      );
      setPostElement(post);
    }
  }, [postInfo]);

  useEffect(() => {
    if (recentPosts != null) {
      const recentPost = (
        <div className="footer">
          {recentPosts.prev && (
            <Link
              className="prevContainer"
              to={`/post/${postInfo.user.userNickName}/${recentPosts.prev.postId}`}
              onClick={onClickPrevPost}
            >
              <section className="buttonSection">
                <button className="buttonPrev">
                  <FontAwesomeIcon icon={faArrowLeft} />
                </button>
              </section>
              <section className="contentSection">
                <span className="title">이전 포스트</span>
                <span className="content">{recentPosts.prev.title}</span>
              </section>
            </Link>
          )}
          {recentPosts.next && (
            <Link
              className="nextContainer"
              to={`/post/${postInfo.user.userNickName}/${recentPosts.next.postId}`}
              onClick={onClickNextPost}
            >
              <section className="contentSection">
                <span className="title">다음 포스트</span>
                <span className="content">{recentPosts.next.title}</span>
              </section>
              <section className="buttonSection">
                <button className="buttonNext">
                  <FontAwesomeIcon icon={faArrowRight} />
                </button>
              </section>
            </Link>
          )}
        </div>
      );

      setRecentElement(recentPost);
    }
  }, [recentPosts]);

  return (
    <div className="postContainer">
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
      {recentElement}
    </div>
  );
}
