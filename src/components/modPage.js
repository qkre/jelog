import { useEffect, useRef } from "react";
import "./writePage.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faImage,
  faLink,
  faQuoteRight,
} from "@fortawesome/free-solid-svg-icons";
import { Link, useLocation } from "react-router-dom";

export default function ModPage(props) {
  const { postList, setPostList } = props;

  const postID = useLocation().pathname.split("/")[2];
  const post = postList.find((item) => item.id === postID);

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

  const handleModPost = () => {
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
    const updatedPosts = postList.map((item) =>
      item.id === postID ? modifiedPost : item
    );

    setPostList(updatedPosts);
  };

  return (
    <section className={"container"}>
      <section className={"inputSection"}>
        <div>
          <textarea
            ref={titleTextareaRef}
            className={"title"}
            onChange={handleTitleChange}
            placeholder="제목을 입력하세요"
            rows={1}
          />
          <div className={"titleBar"} />
          <input
            className={"tag"}
            type="textarea"
            placeholder="태그를 입력하세요."
          />
          <section className={"buttons"}>
            <button className={"buttonH"}>
              H<sub>1</sub>
            </button>
            <button className={"buttonH"}>
              H<sub>2</sub>
            </button>
            <button className={"buttonH"}>
              H<sub>3</sub>
            </button>
            <button className={"buttonH"}>
              H<sub>4</sub>
            </button>
            <span className={"buttonBar"}>|</span>
            <button className={"buttonBold"}>B</button>
            <button className={"buttonItalic"}>I</button>
            <button className={"buttonDel"}>
              <del>T</del>
            </button>
            <span className={"buttonBar"}>|</span>
            <button className={"buttonHighligt"}>
              <FontAwesomeIcon icon={faQuoteRight} />
            </button>
            <button className={"buttonURL"}>
              <FontAwesomeIcon icon={faLink} />
            </button>
            <button className={"buttonImage"}>
              <FontAwesomeIcon icon={faImage} />
            </button>
            <button className={"buttonCode"}>{"<>"}</button>
          </section>
          <textarea
            ref={contentTextareaRef}
            className={"content"}
            placeholder="당신의 이야기를 적어보세요..."
            onChange={handleContentChange}
          />
        </div>
        <section className={"bottomSection"}>
          <Link to={"/"} className={"buttonExit"}>
            <FontAwesomeIcon icon={faArrowLeft} />
            {" 나가기"}
          </Link>
          <div>
            <Link to={"/"} className={"buttonSave"}>
              임시저장
            </Link>
            <Link to={"/"} className={"buttonPost"} onClick={handleModPost}>
              수정하기
            </Link>
          </div>
        </section>
      </section>
      <section className={"previewSection"}>
        <textarea
          ref={previewTitleRef}
          className={"previewTitle"}
          readOnly={true}
          disabled={true}
        ></textarea>
        <textarea
          ref={previewContentRef}
          className={"previewContent"}
          readOnly={true}
          disabled={true}
        ></textarea>
      </section>
    </section>
  );
}
