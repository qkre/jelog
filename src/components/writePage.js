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
import imageCompression from "browser-image-compression";

export default function WritePage(props) {
  const { USER, accountList } = props;

  const navigate = useNavigate();

  const titleTextareaRef = useRef();
  const contentTextareaRef = useRef();
  const previewTitleRef = useRef();
  const previewContentRef = useRef();
  const imageSelectorRef = useRef();
  const buttonPostRef = useRef();

  const [isError, setIsError] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

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

    contentTextareaRef.current.scrollTop =
      contentTextareaRef.current.scrollHeight;

    console.log("handleContentChange Applied");
    errCheck();
  };

  const resizeImage = async (image) => {
    // 현재 커서 위치 저장
    const sel = window.getSelection();
    let savedRange;
    if (sel.rangeCount > 0) {
      savedRange = sel.getRangeAt(0);
    }

    setIsLoading(true);
    const resizingBlob = await imageCompression(image, {
      maxSizeMB: 1,
      maxWidthOrHeight: 800,
      useWebWorker: true,
    });
    setIsLoading(false);
    const resizingFile = new File([resizingBlob], image.name, {
      type: image.type,
    });

    // 저장한 커서 위치 복원
    if (savedRange) {
      sel.removeAllRanges();
      sel.addRange(savedRange);
    }

    return resizingFile;
  };

  const uploadImage = async () => {
    const fileInput = document.querySelector(".imageSelector");
    if (fileInput.files[0]) {
      const file = await resizeImage(fileInput.files[0]);
      const formData = new FormData();
      console.log(file);
      formData.append("file", file);

      try {
        const response = await axios.post("/api/uploadImage", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        const imageURL = response.data;
        console.log("InsertImageToEditor Start");
        await insertImageToEditor(imageURL);
        console.log("InsertImageToEditor End");

        // handleContentChange();
      } catch (err) {
        console.error("Error uploadTets : ", err);
      }
    }
  };

  const insertImageToEditor = async (imageURL) => {
    const imgTag = document.createElement("img");
    imgTag.src = imageURL;
    const sel = window.getSelection();
    let range;

    // 현재 선택된 커서 위치를 가져옴.
    if (sel.rangeCount) {
      range = sel.getRangeAt(0);
    }

    // 커서가 contentTextareRef 내부에 있는지 확인
    if (
      range &&
      contentTextareaRef.current.contains(range.commonAncestorContainer)
    ) {
      await range.insertNode(imgTag);

      // 이미지 뒤로 커서 설정
      range.setStartAfter(imgTag);
      range.collapse(true);
      sel.removeAllRanges();
      sel.addRange(range);
    } else {
      // 커서가 밖에 있거나, 선택되지 않은 경우
      await contentTextareaRef.current.appendChild(imgTag);

      range = document.createRange();
      range.setStartAfter(imgTag);
      range.collapse(true);
      sel.removeAllRanges();
      sel.addRange(range);
    }

    const imageLoadPromise = new Promise((resolve) => {
      imgTag.onload = resolve;
    });

    await imageLoadPromise;
    await handleContentChange();
    contentTextareaRef.current.focus();
  };

  const handleAddPost = async () => {
    if (!isError) {
      const title = titleTextareaRef.current.value;
      let content = previewContentRef.current.outerHTML;

      const imgTags = previewContentRef.current.querySelectorAll("img");
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
      {isLoading && (
        <div className="loadingSpinner">
          <span className="loadingText">Uploading..</span>
        </div>
      )}
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
          >
            {""}
          </div>
          <input
            ref={imageSelectorRef}
            className="imageSelector hide"
            type="file"
            accept="image/*"
            onChange={() => {
              uploadImage();
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
