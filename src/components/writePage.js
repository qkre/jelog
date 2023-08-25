import { useRef, useState } from "react";
import "./writePage.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faClose,
  faImage,
  faLink,
  faQuoteRight,
} from "@fortawesome/free-solid-svg-icons";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

export default function WritePage(props) {
  const { USER, accountList, postList, setPostList } = props;

  const navigate = useNavigate();

  const titleTextareaRef = useRef();
  const contentTextareaRef = useRef();
  const previewTitleRef = useRef();
  const previewContentRef = useRef();
  const imageSelectorRef = useRef();
  const buttonPostRef = useRef();

  const [isError, setIsError] = useState(true);

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

  const uploadImage = async () => {
    const fileInput = document.querySelector(".imageSelector");
    const file = fileInput.files[0];

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post("/api/uploadImage", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      const imageURL = response.data;
      insertImageToEditor(imageURL);
      console.log(response);
      return imageURL;
    } catch (err) {
      console.error("Error uploadTets : ", err);
    }
  };

  const insertImageToEditor = async (imageURL) => {
    const imgTag = document.createElement("img");
    imgTag.src = imageURL;
    contentTextareaRef.current.appendChild(imgTag);
  };

  const handleAddPost = async () => {
    if (!isError) {
      const title = titleTextareaRef.current.value;
      let content = contentTextareaRef.current.outerHTML;

      const imgTags = contentTextareaRef.current.querySelectorAll("img");
      for (let img of imgTags) {
        if (img.src.startsWith("data:image/")) {
          const imgUrl = await uploadImage(img.src);
          content = content.replace(img.src, imgUrl);
        }
      }

      const publisher = USER.userID;

      axios
        .post("/api/publish", {
          title: title,
          content: content,
          publisher: publisher,
        })
        .then((res) => {
          console.log(res);
          document.querySelector(".headerContainer").classList.remove("hide");
          navigate("/");
        })
        .catch((err) => console.log(err));
    }
  };

  const handleAddSavePost = () => {
    if (!isError) {
      const today = new Date();
      const title = titleTextareaRef.current.value;
      const content = previewContentRef.current.outerHTML;
      const savePost = {
        userID: USER.userID,
        id: USER.saveIndex,
        title: title,
        content: content,
        date: today.toLocaleDateString(),
        likesCount: 0,
        isSavedPost: true,
      };

      if (USER.saveIndex > 0) {
        const modifiedList = [...USER.savedPost];
        modifiedList[USER.saveIndex] = savePost;
        USER.savedPost = modifiedList;
      } else {
        USER.savedPost.push(savePost);
      }
      USER.saveIndex += 1;
      updateAccountList();
      localStorage.setItem("accountList", JSON.stringify(accountList));
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
      {" "}
      <section className={"inputSection"}>
        {" "}
        <div>
          {" "}
          <textarea
            ref={titleTextareaRef}
            className={"title"}
            onChange={handleTitleChange}
            placeholder="제목을 입력하세요"
            rows={1}
          />{" "}
          <div className={"titleBar"} />{" "}
          <input
            className={"tag"}
            type="textarea"
            placeholder="태그를 입력하세요."
          />{" "}
          <section className={"buttons"}>
            {" "}
            <button className={"buttonH"}>
              {" "}
              H<sub> 1</sub>
            </button>{" "}
            <button className={"buttonH"}>
              {" "}
              H<sub> 2</sub>
            </button>{" "}
            <button className={"buttonH"}>
              {" "}
              H<sub> 3</sub>
            </button>{" "}
            <button className={"buttonH"}>
              {" "}
              H<sub> 4</sub>
            </button>{" "}
            <span className={"buttonBar"}>|</span>
            <button className={"buttonBold"}>B</button>{" "}
            <button className={"buttonItalic"}> I</button>{" "}
            <button className={"buttonDel"}>
              {" "}
              <del> T</del>
            </button>{" "}
            <span className={"buttonBar"}>|</span>
            <button className={"buttonHighligt"}>
              <FontAwesomeIcon icon={faQuoteRight} />{" "}
            </button>{" "}
            <button className={"buttonURL"}>
              {" "}
              <FontAwesomeIcon icon={faLink} />{" "}
            </button>{" "}
            <button
              className={"buttonImage"}
              onClick={() => {
                imageSelectorRef.current.click();
              }}
            >
              {" "}
              <FontAwesomeIcon icon={faImage} />{" "}
            </button>{" "}
            <button className={"buttonCode"}> {"<>"}</button>
          </section>{" "}
          <div
            contentEditable="true"
            ref={contentTextareaRef}
            className={"content"}
            placeholder="당신의 이야기를 적어보세요..."
            onInput={handleContentChange}
          >
            {"\n"}
          </div>
          <input
            ref={imageSelectorRef}
            className="imageSelector hide"
            type="file"
            accept="image/*"
            onChange={() => {
              const url = uploadImage();
            }}
          />{" "}
        </div>{" "}
        <section className={"bottomSection"}>
          {" "}
          <Link
            to={"/"}
            className={"buttonExit"}
            onClick={() => {
              const headerContainer =
                document.querySelector(".headerContainer");
              headerContainer.classList.remove("hide");
            }}
          >
            {" "}
            <FontAwesomeIcon icon={faArrowLeft} /> {" 나가기"}
          </Link>
          <div>
            {" "}
            <button className={"buttonSave"} onClick={handleAddSavePost}>
              {" "}
              임시저장
            </button>{" "}
            <button
              ref={buttonPostRef}
              className={"buttonPost"}
              onClick={handleAddPost}
            >
              {" "}
              출간하기
            </button>
          </div>
        </section>
      </section>{" "}
      <section className={"previewSection"}>
        {" "}
        <textarea
          ref={previewTitleRef}
          className={"previewTitle"}
          readOnly={true}
          disabled={true}
        >
          {" "}
        </textarea>{" "}
        <div
          ref={previewContentRef}
          className={"previewContent"}
          onClick={() => {
            console.log(document.querySelector(".previewContent"));
          }}
        />{" "}
      </section>
    </section>
  );
}
