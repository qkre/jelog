import { useEffect, useRef, useState } from "react";
import "./writePage.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faClose,
  faImage,
  faLink,
  faQuoteRight,
} from "@fortawesome/free-solid-svg-icons";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Modal from "react-modal";

export default function ModPage(props) {
  const { USER, postList, setPostList } = props;

  const [isError, setIsError] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  const userID = useLocation().pathname.split("/")[2];
  const postID = parseInt(useLocation().pathname.split("/")[3]);
  const post = USER.posts[postID];
  const titleTextareaRef = useRef();
  const contentTextareaRef = useRef();
  const previewTitleRef = useRef();
  const previewContentRef = useRef();
  const imageSelectorRef = useRef();
  const buttonPostRef = useRef();
  const postHTML = new DOMParser()
    .parseFromString(post.content, "text/html")
    .querySelector("div").innerHTML;

  useEffect(() => {
    titleTextareaRef.current.value = post.title;
    contentTextareaRef.current.innerHTML = postHTML;
    previewTitleRef.current.value = post.title;
    previewContentRef.current.innerHTML = contentTextareaRef.current.innerHTML;
    // console.log(post.content);
    if (checkSavedPost()) {
      setShowModal(true);
    }
  }, []);

  const checkSavedPost = () => {
    const result = post.savedPost !== undefined;
    console.log(result);
    return result;
  };

  const handleTitleChange = () => {
    titleTextareaRef.current.style.height = "auto";
    titleTextareaRef.current.style.height =
      titleTextareaRef.current.scrollHeight + "px";
    previewTitleRef.current.style.height =
      titleTextareaRef.current.scrollHeight + "px";
    previewTitleRef.current.value = titleTextareaRef.current.value;
    errCheck();
  };

  const handleContentChange = () => {
    contentTextareaRef.current.style.height = "auto";
    contentTextareaRef.current.style.height =
      contentTextareaRef.current.scrollHeight + "px";
    previewContentRef.current.style.height =
      contentTextareaRef.current.scrollHeight + "px";
    previewContentRef.current.innerHTML = contentTextareaRef.current.innerHTML;
    errCheck();
  };

  const handleModPost = () => {
    if (!isError) {
      const today = new Date();
      const title = titleTextareaRef.current.value;
      const content = previewContentRef.current.outerHTML;
      const modifiedPost = {
        userID: userID,
        id: postID,
        title: title,
        content: content,
        likesCount: post.likesCount,
        date: today.toLocaleDateString(),
      };
      const updatedPostList = [...postList];
      updatedPostList[postID] = modifiedPost;
      USER.posts = updatedPostList;

      const headerContainer = document.querySelector(".headerContainer");
      headerContainer.classList.remove("hide");

      setPostList(updatedPostList);
      localStorage.setItem("postList", JSON.stringify(updatedPostList));

      localStorage.setItem("USER", JSON.stringify(USER));

      navigate("/");
    }
  };

  const handleAddSavePost = () => {
    if (!isError) {
      const today = new Date();
      const title = titleTextareaRef.current.value;
      const content = previewContentRef.current.outerHTML;
      const modifiedPost = {
        userID: userID,
        id: postID,
        title: post.title,
        content: post.content,
        likesCount: post.likesCount,
        date: today.toLocaleDateString(),
        savedPost: {
          title: title,
          content: content,
        },
      };

      USER.posts[postID] = modifiedPost;

      localStorage.setItem("USER", JSON.stringify(USER));

      showAlertPopUp();
    }
  };

  const errCheck = () => {
    if (
      previewContentRef.current.innerHTML === "" ||
      titleTextareaRef.current.value === ""
    ) {
      buttonPostRef.current.removeAttribute("href");
      setIsError(true);
    } else {
      buttonPostRef.current.setAttribute("href", "/");
      setIsError(false);
    }
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const loadSavedPost = () => {
    const contentHTML = new DOMParser()
      .parseFromString(post.savedPost.content, "text/html")
      .querySelector("div").innerHTML;
    titleTextareaRef.current.value = post.savedPost.title;
    contentTextareaRef.current.innerHTML = contentHTML;
    previewTitleRef.current.value = post.savedPost.title;
    previewContentRef.current.innerHTML = contentTextareaRef.current.innerHTML;
    console.log(contentTextareaRef.current.innerHTML);
    setShowModal(false);
  };

  const showAlertPopUp = () => {
    const alertSaveRef = document.querySelector(".alertSave");
    alertSaveRef.style.display = "flex";
    setTimeout(() => {
      alertSaveRef.style.display = "none";
    }, 2000);
  };

  const focusEditor = (item, result) => {
    console.log(item);
    item.current.focus({ preventScroll: true });
    document.execCommand("insertImage", false, `${result}`);
  };

  const insertImageDate = (file) => {
    const reader = new FileReader();
    reader.addEventListener("load", function (e) {
      focusEditor(contentTextareaRef, reader.result);
    });
    reader.readAsDataURL(file);
  };

  return (
    <section className={"writeContainer"}>
      <Modal isOpen={showModal} className="loadSaveModalContainer">
        <span className="title">임시 포스트 불러오기</span>
        <span className="content">임시저장된 포스트를 불러오시겠습니까?</span>
        <div className="functions">
          <span className="no" onClick={closeModal}>
            취소
          </span>
          <span className="ok" onClick={loadSavedPost}>
            확인
          </span>
        </div>
      </Modal>
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
                imageSelectorRef.current.click();
              }}
            >
              <input
                ref={imageSelectorRef}
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
            <button className={"buttonSave"} onClick={handleAddSavePost}>
              임시저장
            </button>
            <button
              ref={buttonPostRef}
              className={"buttonPost"}
              onClick={handleModPost}
            >
              수정하기
            </button>
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
        <div ref={previewContentRef} className={"previewContent"} />
      </section>
    </section>
  );
}
