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

export default function PostPage(props) {
  const { USER, accountList, postList, setPostList } = props;
  const location = useLocation().pathname;
  const userID = location.split("/")[2];
  const postID = parseInt(location.split("/")[3]);
  const postUSER = accountList.find((user) => user.userID === userID);
  const post = postUSER.posts.find((item) => item.id === postID);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const likesCountRef = useRef();
  const contentSectionRef = useRef();
  const postFunctionsRef = useRef();

  console.log(post);

  const handleButtonDelete = () => {
    setIsModalOpen(!isModalOpen);
  };
  const handleButtonConfirm = () => {
    closeModal();
    if (postList.length > 1) {
      const newPosts = [...postList];
      newPosts.splice(postID, 1);
      setPostList(newPosts);
      USER.posts.splice(postID, 1);
      localStorage.setItem("USER", JSON.stringify(USER));
      localStorage.setItem("postList", JSON.stringify(newPosts));
    } else {
      const newPosts = [];
      setPostList(newPosts);
      USER.posts = newPosts;
      localStorage.setItem("USER", JSON.stringify(USER));
      localStorage.setItem("postList", JSON.stringify(newPosts));
    }
  };
  const closeModal = () => {
    setIsModalOpen(false);
  };

  const onClickButtonLike = () => {
    const likesCount = parseInt(likesCountRef.current.innerText) + 1;
    likesCountRef.current.innerText = likesCount;
    const modifiedPost = {
      userID: post.userID,
      id: postID,
      title: post.title,
      content: post.content,
      date: post.date,
      likesCount: likesCount,
    };
    const updatedPosts = postList.map((item) =>
      item.id === postID ? modifiedPost : item
    );

    setPostList(updatedPosts);
  };

  const parser = new DOMParser();
  const content = parser
    .parseFromString(post.content, "text/html")
    .querySelector("div");

  useEffect(() => {
    contentSectionRef.current.appendChild(content);
    if (USER === undefined) {
      postFunctionsRef.current.classList.add("hide");
    } else {
      if (location.split("/")[2] === USER.userID) {
        postFunctionsRef.current.classList.remove("hide");
      } else {
        postFunctionsRef.current.classList.add("hide");
      }
    }
  }, []);

  return (
    <div>
      <Modal
        className={"deleteModal"}
        isOpen={isModalOpen}
        onRequestClose={closeModal}
      >
        <span className={"modalTitle"}>포스트 삭제</span>
        <span className={"modalContent"}>정말로 삭제하시겠습니까?</span>
        <div className={"modalButtons"}>
          <button className={"buttonCancel"} onClick={closeModal}>
            취소
          </button>
          <Link
            to="/"
            className={"buttonConfirm"}
            onClick={handleButtonConfirm}
          >
            확인
          </Link>
        </div>
      </Modal>
      <section className={"postContainer"}>
        <section className={"sideBarSection"}>
          <div className={"sideBarMenu"}>
            <button className={"buttonLike"} onClick={onClickButtonLike}>
              <FontAwesomeIcon icon={faHeart} />
            </button>
            <span ref={likesCountRef} className={"likesCount"}>
              {post.likesCount}
            </span>
            <button className={"buttonShare"}>
              <FontAwesomeIcon icon={faShare} />
            </button>
          </div>
        </section>
        <section className={"mainSection"}>
          <section className={"headerSection"}>
            <span className={"title"}>{post.title}</span>
            <section className={"postInfoSection"}>
              <div className={"userInfo"}>
                <span className={"userID"}>user ID</span>
                <span className={"uploadDate"}>{post.date}</span>
              </div>
              <div ref={postFunctionsRef} className={"postFunctions hide"}>
                <span className={"buttonStat"}>통계</span>
                <Link
                  to={`/write/${post.userID}/${post.id}`}
                  className={"buttonMod"}
                  onClick={() => {
                    document
                      .querySelector(".headerContainer")
                      .classList.add("hide");
                  }}
                >
                  수정
                </Link>
                <span className={"buttonDelete"} onClick={handleButtonDelete}>
                  삭제
                </span>
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
          <section ref={contentSectionRef}></section>
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
}
