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

export default function SaveWritePage(props) {
  const { USER, accountList, postList, setPostList } = props;

  const location = useLocation().pathname;
  const navigate = useNavigate();

  const savedPost = USER.savedPost.find(
    (item) => item.id === parseInt(location.split("/")[3])
  );

  const contentHTML = new DOMParser()
    .parseFromString(savedPost.content, "text/html")
    .querySelector("div").innerHTML;

  const titleTextareaRef = useRef();
  const contentTextareaRef = useRef();
  const previewTitleRef = useRef();
  const previewContentRef = useRef();
  const alertSaveRef = useRef();
  const imageSelectorRef = useRef();
  const buttonPostRef = useRef();
  const [isError, setIsError] = useState(true);

  useEffect(() => {
    titleTextareaRef.current.value = savedPost.title;
    contentTextareaRef.current.innerHTML = contentHTML;
    previewTitleRef.current.value = savedPost.title;
    previewContentRef.current.innerHTML = contentHTML;
  });

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

  const handleAddPost = () => {
    if (!isError) {
      const today = new Date();
      const title = titleTextareaRef.current.value;
      const content = previewContentRef.current.outerHTML;
      const newPost = {
        userID: savedPost.userID,
        id: USER.posts.length,
        title: title,
        content: content,
        date: today.toLocaleDateString(),
        likesCount: 0,
      };
      const newPostList = [...postList, newPost];
      setPostList(newPostList);
      localStorage.setItem("postList", JSON.stringify(newPostList));
      USER.posts.push(newPost);
      USER.postIndex += 1;
      const headerContainer = document.querySelector(".headerContainer");
      headerContainer.classList.remove("hide");

      if (USER.savedPost.length > 1) {
        USER.savedPost.splice(savedPost.id, 1);
      } else {
        USER.savedPost = [];
      }

      updateAccountList();
      localStorage.setItem("USER", JSON.stringify(USER));

      navigate("/");
    }
  };

  const handleAddSavePost = () => {
    if (!isError) {
      const today = new Date();
      const title = titleTextareaRef.current.value;
      const content = previewContentRef.current.outerHTML;
      const savePost = {
        userID: savedPost.userID,
        id: savedPost.id,
        title: title,
        content: content,
        date: today.toLocaleDateString(),
        likesCount: 0,
        isSavedPost: true,
      };

      if (USER.savedPost.length > 0) {
        const modifiedList = [...USER.savedPost];
        modifiedList[savedPost.id] = savePost;
        USER.savedPost = modifiedList;
      } else {
        USER.savedPost.push(savePost);
      }
      updateAccountList();
      localStorage.setItem("USER", JSON.stringify(USER));

      showAlertPopUp();
    }
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

  const updateAccountList = () => {
    accountList.forEach((item, index) => {
      if (item.userID === USER.userID) {
        accountList[index] = USER;
        return;
      }
    });
    localStorage.setItem("accountList", JSON.stringify(accountList));
  };

  return (
    <section className={"writeContainer"}>
      <div ref={alertSaveRef} className="alertSave hide">
        <span className="content"> 포스트가 임시저장되었습니다.</span>
        <span className="closeButton">
          <FontAwesomeIcon icon={faClose} />
        </span>
      </div>
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
              H<sub> 1</sub>
            </button>
            <button className={"buttonH"}>
              H<sub> 2</sub>
            </button>
            <button className={"buttonH"}>
              H<sub> 3</sub>
            </button>
            <button className={"buttonH"}>
              H<sub> 4</sub>
            </button>
            <span className={"buttonBar"}>|</span>
            <button className={"buttonBold"}>B</button>
            <button className={"buttonItalic"}> I</button>
            <button className={"buttonDel"}>
              <del> T</del>
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
              <FontAwesomeIcon icon={faImage} />
            </button>
            <button className={"buttonCode"}> {"<>"}</button>
          </section>
          <div
            contentEditable="true"
            ref={contentTextareaRef}
            className={"content"}
            placeholder="당신의 이야기를 적어보세요..."
            onInput={handleContentChange}
          />
          <input
            ref={imageSelectorRef}
            className="imageSelector hide"
            type="file"
            accept="image/*"
            onChange={(e) => {
              const files = e.target.files;
              console.log(files);
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
              //   setSavePostID(savePostID + 1);
            }}
          >
            <FontAwesomeIcon icon={faArrowLeft} /> {" 나가기"}
          </Link>
          <div>
            <button className={"buttonSave"} onClick={handleAddSavePost}>
              임시저장
            </button>
            <button
              ref={buttonPostRef}
              className={"buttonPost"}
              onClick={handleAddPost}
            >
              출간하기
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
        <div
          ref={previewContentRef}
          className={"previewContent"}
          onClick={() => {
            console.log(document.querySelector(".previewContent"));
          }}
        />
      </section>
    </section>
  );
}
