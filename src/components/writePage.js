import { useRef } from "react";
import "./writePage.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faImage,
  faLink,
  faQuoteRight,
} from "@fortawesome/free-solid-svg-icons";
import { Link, renderMatches } from "react-router-dom";

export default function WritePage(props) {
  const { postList, setPostList, isLogin, setIsLogin, userID, setUserID } =
    props;

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
      contentTextareaRef.current.scrollHeight + "px";
    previewContentRef.current.innerHTML = contentTextareaRef.current.innerHTML;
  };

  const handleAddPost = () => {
    const today = new Date();
    const title = titleTextareaRef.current.value;
    const content = previewContentRef.current.outerHTML;
    const newPost = {
      userID: userID,
      id: postList.length.toString(),
      title: title,
      content: content,
      date: today.toLocaleDateString(),
      likesCount: 0,
    };
    setPostList([...postList, newPost]);
    const headerContainer = document.querySelector(".headerContainer");
    headerContainer.classList.remove("hide");
  };

  const focusEditor = (item, result) => {
    console.log(item);
    item.focus({ preventScroll: true });
    document.execCommand("insertImage", false, `${result}`);
  };

  const insertImageDate = (file) => {
    const reader = new FileReader();
    reader.addEventListener("load", function (e) {
      focusEditor(document.querySelector(".content"), reader.result);
    });
    reader.readAsDataURL(file);
  };

  return (
    <section className={"writeContainer"}>
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
            <button
              className={"buttonImage"}
              onClick={() => {
                document.querySelector(".imageSelector").click();
              }}
            >
              <FontAwesomeIcon icon={faImage} />
            </button>
            <button className={"buttonCode"}>{"<>"}</button>
          </section>
          <div
            contentEditable="true"
            ref={contentTextareaRef}
            className={"content"}
            placeholder="당신의 이야기를 적어보세요..."
            onInput={handleContentChange}
          />
          <input
            className="imageSelector hide"
            type="file"
            accept="image/*"
            onChange={(e) => {
              const files = e.target.files;
              if (!!files) {
                insertImageDate(files[0]);
              }
            }}
          />
        </div>
        <section className={"bottomSection"}>
          <Link
            to={"/"}
            className={"buttonExit"}
            onClick={() => {
              const headerContainer =
                document.querySelector(".headerContainer");
              headerContainer.classList.remove("hide");
            }}
          >
            <FontAwesomeIcon icon={faArrowLeft} />
            {" 나가기"}
          </Link>
          <div>
            <Link
              to={"/"}
              className={"buttonSave"}
              onClick={() => {
                const headerContainer =
                  document.querySelector(".headerContainer");
                headerContainer.classList.remove("hide");
              }}
            >
              임시저장
            </Link>
            <Link to={"/"} className={"buttonPost"} onClick={handleAddPost}>
              출간하기
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
        <div
          contentEditable
          ref={previewContentRef}
          className={"previewContent"}
          readOnly={true}
          disabled={true}
          onClick={() => {
            console.log(document.querySelector(".previewContent"));
          }}
        />
      </section>
    </section>
  );
}
