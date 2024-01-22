import {
  faArrowDown,
  faArrowLeft,
  faArrowRight,
  faHeart,
  faShare,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link, useParams } from "react-router-dom";
import "./postPage.css";

import axios from "axios";
import moment from "moment";
import "moment/locale/ko";
import { useEffect, useRef, useState } from "react";
import Modal from "react-modal";
import Header from "./header";

export default function PostPage(props) {
  const userInfo = JSON.parse(sessionStorage.getItem("userInfo"));
  const token = sessionStorage.getItem("token");

  const { isLogin, setIsLogin, loginModalShow, setLoginModalShow } = props;

  const [location, setLocation] = useState();

  const [recentPosts, setRecentPosts] = useState(null);
  const [recentElement, setRecentElement] = useState();
  const [postInfo, setPostInfo] = useState(null);
  const [postElement, setPostElement] = useState();
  const [commentInputElement, setCommentInputElement] = useState();
  const [commentsElement, setCommentsElement] = useState();

  const [editableComment, setEditableComment] = useState();

  const [isLiked, setIsLiked] = useState();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const { userNickName, postId } = useParams();

  const likesCountRef = useRef();
  const commentTextAreaRef = useRef();
  const editCommentTextAreaRef = useRef();

  const showModal = () => {
    setIsDeleteModalOpen(true);
  };

  const fromNow = (createdAt) => {
    const momentAt = moment(createdAt);

    return <span className="createdAt">{momentAt.fromNow()}</span>;
  };

  const deleteModalFunctions = {
    closeModal: () => {
      setIsDeleteModalOpen(false);
    },
    onClickButtonConfirm: () => {
      deleteModalFunctions.closeModal();
      console.log(postId);
      axios
        .delete(
          `/api/private/post`,
          {
            token: token,
            postId: postId,
            userEmail: userInfo.userEmail,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
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
          "/api/private/post/like",
          {
            token: token,
            postId: postInfo.postId,
            userEmail: userInfo.userEmail,
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
        .delete("/api/private/post/like", {
          data: {
            token: token,
            postId: postInfo.postId,
            userEmail: userInfo.userEmail,
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
    if (data.postLikes.find((like) => like.userId === userInfo.userId)) {
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

  const onClickAddCommentsButton = () => {
    if (isLogin) {
      axios
        .post(
          "/api/private/comment/write",
          {
            token: token,
            userEmail: userInfo.userEmail,
            postId: postInfo.postId,
            content: commentTextAreaRef.current.value,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        .then((res) => {
          console.log(res.data);
          window.location.reload();
        })
        .catch((err) => {
          console.error(err);
        });
    } else {
      setLoginModalShow(true);
    }
  };

  const onClickCommentModifyButton = (commentId) => {
    setEditableComment(commentId);
  };

  const onClickcommentModifyConfirmButton = (commentId) => {
    axios
      .put(
        "/api/private/comment/write",
        {
          token: token,
          userEmail: userInfo.userEmail,
          postId: postId,
          commentId: commentId,
          content: editCommentTextAreaRef.current.value,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .then((res) => {
        console.log(res.data);
        setEditableComment(null);
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    console.log(location);
    axios
      .get(`/api/public/post/${userNickName}/${postId}`)
      .then((res) => {
        console.log(res.data);
        const result = isAlreadyLiked(res.data);
        setIsLiked(result);
      })
      .catch((err) => console.error(err));
  }, [location]);

  useEffect(() => {
    if (postId != null && userNickName != null) {
      axios
        .get(`/api/public/post/${userNickName}/${postId}`)
        .then((res) => {
          setPostInfo(res.data);
        })
        .catch((err) => console.error(err));
    }
  }, [isLiked, editableComment, location]);

  useEffect(() => {
    if (postInfo != null) {
      axios
        .get("/api/public/post/recent", {
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
                {postInfo.postLikes.length}
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
                <div className="postInfo">
                  <span className="userNickName">
                    {postInfo.user.userNickName}
                  </span>
                  {fromNow(postInfo.createAt)}
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
          <section className={"sideBarSection"}>
            <div className={"summaryIndexes"}>
              <span>Index1</span>
              <span>Index2</span>
              <span>Index3</span>
            </div>
          </section>
        </section>
      );

      const commentInput = (
        <section className="commentInputSection">
          <span className="title">{postInfo.comments.length}개의 댓글</span>
          <textarea
            className="content"
            ref={commentTextAreaRef}
            placeholder="내용을 입력하세요..."
          />
          <section className="buttonSection">
            <button
              className="addCommentsButton"
              onClick={onClickAddCommentsButton}
            >
              댓글 작성
            </button>
          </section>
        </section>
      );

      const comments = postInfo.comments.map((comment) => {
        const isEditable = editableComment === comment.commentId;
        return (
          <section className="commentSection" key={comment.commentId}>
            <div className="header">
              <div className="userInfo">
                <div
                  className="userIcon"
                  style={{ backgroundColor: comment.user.userIcon }}
                />
                <div className="commentInfo">
                  <span className="userNickName">
                    {comment.user.userNickName}
                  </span>
                  {fromNow(comment.createdAt)}
                </div>
              </div>
              <div className="commentFunctions">
                {!isEditable && (
                  <button
                    className="modifyButton"
                    onClick={() => {
                      onClickCommentModifyButton(comment.commentId);
                    }}
                  >
                    수정
                  </button>
                )}
                <button className="deleteButton">삭제</button>
              </div>
            </div>
            {!isEditable ? (
              <span className="content">{comment.content}</span>
            ) : (
              <section className="editCommentSection">
                <textarea
                  className="editCommentTextArea"
                  ref={editCommentTextAreaRef}
                  defaultValue={comment.content}
                />
                <div className="editCommentButtons">
                  <button
                    className="cancelButton"
                    onClick={() => {
                      setEditableComment(null);
                    }}
                  >
                    취소
                  </button>
                  <button
                    className="modifyConfirmButton"
                    onClick={() => {
                      onClickcommentModifyConfirmButton(comment.commentId);
                    }}
                  >
                    댓글 수정
                  </button>
                </div>
              </section>
            )}
          </section>
        );
      });
      setPostElement(post);
      setCommentInputElement(commentInput);
      setCommentsElement(comments);
    }
  }, [postInfo]);

  useEffect(() => {
    if (recentPosts != null) {
      const recentPost = (
        <div className="recentSection">
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
      <section className="header">
        <Header
          isLogin={isLogin}
          setIsLogin={setIsLogin}
          loginModalShow={loginModalShow}
          setLoginModalShow={setLoginModalShow}
        />
      </section>
      <section className="body">
        {postElement}
        {recentElement}
        {commentInputElement}
        {commentsElement}
      </section>
    </div>
  );
}
