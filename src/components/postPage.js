import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Header from "./header";
import styles from "./postPage.module.css";
import {
  faArrowDown,
  faHeart,
  faShare,
} from "@fortawesome/free-solid-svg-icons";
import { Link, useLocation } from "react-router-dom";
import Modal from "react-modal";
import { useRef, useState } from "react";

export default function PostPage(props) {
  const { postList, setPostList, userID } = props;
  const postID = useLocation().pathname.split("/")[3];
  const post = postList.find((item) => item.id === postID);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const likesCountRef = useRef();

  const handleButtonDelete = () => {
    setIsModalOpen(!isModalOpen);
  };
  const handleButtonConfirm = () => {
    closeModal();
    const newPosts = [...postList];
    newPosts.splice(postID, 1);
    setPostList(newPosts);
  };
  const closeModal = () => {
    setIsModalOpen(false);
  };

  const onClickButtonLike = () => {
    const likesCount = parseInt(likesCountRef.current.innerText) + 1;
    likesCountRef.current.innerText = likesCount;
    const modifiedPost = {
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

  return (
    <div>
      <Modal
        className={styles.deleteModal}
        isOpen={isModalOpen}
        onRequestClose={closeModal}
      >
        <span className={styles.modalTitle}>포스트 삭제</span>
        <span className={styles.modalContent}>정말로 삭제하시겠습니까?</span>
        <div className={styles.modalButtons}>
          <button className={styles.buttonCancel} onClick={closeModal}>
            취소
          </button>
          <Link
            to="/"
            className={styles.buttonConfirm}
            onClick={handleButtonConfirm}
          >
            확인
          </Link>
        </div>
      </Modal>
      <section className={styles.container}>
        <section className={styles.sideBarSection}>
          <div className={styles.sideBarMenu}>
            <button className={styles.buttonLike} onClick={onClickButtonLike}>
              <FontAwesomeIcon icon={faHeart} />
            </button>
            <span ref={likesCountRef} className={styles.likesCount}>
              {post.likesCount}
            </span>
            <button className={styles.buttonShare}>
              <FontAwesomeIcon icon={faShare} />
            </button>
          </div>
        </section>
        <section className={styles.mainSection}>
          <section className={styles.headerSection}>
            <span className={styles.title}>{post.title}</span>
            <section className={styles.postInfoSection}>
              <div className={styles.userInfo}>
                <span className={styles.userID}>user ID</span>
                <span className={styles.uploadDate}>{post.date}</span>
              </div>
              <div className={styles.postFunctions}>
                <span className={styles.buttonStat}>통계</span>
                <Link to={`/write/${post.id}`} className={styles.buttonMod}>
                  수정
                </Link>
                <span
                  className={styles.buttonDelete}
                  onClick={handleButtonDelete}
                >
                  삭제
                </span>
              </div>
            </section>
            <section className={styles.tagSection}>
              <span className={styles.tag}>Tag1</span>
              <span className={styles.tag}>Tag2</span>
              <span className={styles.tag}>Tag3</span>
              <span className={styles.tag}>Tag4</span>
            </section>
          </section>
          <section className={styles.seriesSection}>
            <span className={styles.seriesTitle}>Series Title</span>
            <div className={styles.indicators}>
              <button className={styles.buttonShowList}>
                <FontAwesomeIcon icon={faArrowDown} />
                {" 목록보기"}
              </button>
              <div className={styles.pageIndicators}>
                <span className={styles.pages}>1 / 1</span>
                <button className={styles.buttonBack}>{"<"}</button>
                <button className={styles.buttonForward}>{">"}</button>
              </div>
            </div>
          </section>
          <section className={styles.contentSection}>
            <span>{post.content}</span>
          </section>
        </section>
        <section className={styles.summarySection}>
          <div className={styles.summaryIndexes}>
            <span>Index1</span>
            <span>Index2</span>
            <span>Index3</span>
          </div>
        </section>
      </section>
    </div>
  );
}
