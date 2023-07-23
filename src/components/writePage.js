import { useRef } from "react";
import styles from "./writePage.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faImage,
  faLink,
  faQuoteRight,
} from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";

export default function WritePage(props) {
  const { posts, addPost } = props;

  const titleTextareaRef = useRef();
  const contentTextareaRef = useRef();
  const previewTitleRef = useRef();
  const previewContentRef = useRef();

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
    const newPost = {
      title: title,
      content: content,
      date: `${today.getFullYear()}년 ${
        today.getMonth() + 1
      }월 ${today.getDate()}일`,
    };
    addPost([...posts, newPost]);
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
              출간하기
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
