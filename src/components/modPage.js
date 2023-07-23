import { useEffect, useRef } from "react";
import styles from "./writePage.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faImage,
  faLink,
  faQuoteRight,
} from "@fortawesome/free-solid-svg-icons";
import { Link, useLocation } from "react-router-dom";

export default function ModPage(props) {
  const { posts, setPost } = props;

  const postID = useLocation().pathname.split("/")[2];
  const post = posts.find((item) => item.id === postID);

  const titleTextareaRef = useRef();
  const contentTextareaRef = useRef();
  const previewTitleRef = useRef();
  const previewContentRef = useRef();

  useEffect(() => {
    titleTextareaRef.current.value = post.title;
    contentTextareaRef.current.value = post.content;
    previewTitleRef.current.value = post.title;
    previewContentRef.current.value = post.content;
  });

  const handleTitleChange = () => {
    titleTextareaRef.current.style.height = "auto";
    titleTextareaRef.current.style.height =
      titleTextareaRef.current.scrollHeight + "px";
    previewTitleRef.current.style.height =
      titleTextareaRef.current.scrollHeight + "px";
    previewTitleRef.current.value = titleTextareaRef.current.value;
  };

  const handleContentChange = () => {
    contentTextareaRef.current.style.height = "auto";
    contentTextareaRef.current.style.height =
      contentTextareaRef.current.scrollHeight + "px";
    previewContentRef.current.style.height =
      contentTextareaRef.current.style.height;
    previewContentRef.current.value = contentTextareaRef.current.value;
  };

  const handleAddPost = () => {
    const today = new Date();
    const title = titleTextareaRef.current.value;
    const content = contentTextareaRef.current.value;
    const modifiedPost = {
      id: postID,
      title: title,
      content: content,
      likesCount: post.likesCount,
      date: today.toLocaleDateString(),
    };
    const updatedPosts = posts.map((item) =>
      item.id === postID ? modifiedPost : item
    );

    setPost(updatedPosts);
  };

  return (
    <section className={styles.container}>
      <section className={styles.inputSection}>
        <div>
          <textarea
            ref={titleTextareaRef}
            className={styles.title}
            onChange={handleTitleChange}
            placeholder="제목을 입력하세요"
            rows={1}
          />
          <div className={styles.titleBar} />
          <input
            className={styles.tag}
            type="textarea"
            placeholder="태그를 입력하세요."
          />
          <section className={styles.buttons}>
            <button className={styles.buttonH}>
              H<sub>1</sub>
            </button>
            <button className={styles.buttonH}>
              H<sub>2</sub>
            </button>
            <button className={styles.buttonH}>
              H<sub>3</sub>
            </button>
            <button className={styles.buttonH}>
              H<sub>4</sub>
            </button>
            <span className={styles.buttonBar}>|</span>
            <button className={styles.buttonBold}>B</button>
            <button className={styles.buttonItalic}>I</button>
            <button className={styles.buttonDel}>
              <del>T</del>
            </button>
            <span className={styles.buttonBar}>|</span>
            <button className={styles.buttonHighligt}>
              <FontAwesomeIcon icon={faQuoteRight} />
            </button>
            <button className={styles.buttonURL}>
              <FontAwesomeIcon icon={faLink} />
            </button>
            <button className={styles.buttonImage}>
              <FontAwesomeIcon icon={faImage} />
            </button>
            <button className={styles.buttonCode}>{"<>"}</button>
          </section>
          <textarea
            ref={contentTextareaRef}
            className={styles.content}
            placeholder="당신의 이야기를 적어보세요..."
            onChange={handleContentChange}
          />
        </div>
        <section className={styles.bottomSection}>
          <Link to={"/"} className={styles.buttonExit}>
            <FontAwesomeIcon icon={faArrowLeft} />
            {" 나가기"}
          </Link>
          <div>
            <Link to={"/"} className={styles.buttonSave}>
              임시저장
            </Link>
            <Link
              to={"/"}
              className={styles.buttonPost}
              onClick={handleAddPost}
            >
              수정하기
            </Link>
          </div>
        </section>
      </section>
      <section className={styles.previewSection}>
        <textarea
          ref={previewTitleRef}
          className={styles.previewTitle}
          readOnly={true}
          disabled={true}
        ></textarea>
        <textarea
          ref={previewContentRef}
          className={styles.previewContent}
          readOnly={true}
          disabled={true}
        ></textarea>
      </section>
    </section>
  );
}
