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
import axios from "axios";

export default function ModPage(props) {
  const { USER } = props;

  const [isError, setIsError] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [article, setArticle] = useState();

  const publisher = useLocation().pathname.split("/")[2];
  const articleID = parseInt(useLocation().pathname.split("/")[3]);

  const titleTextareaRef = useRef();
  const contentTextareaRef = useRef();
  const previewTitleRef = useRef();
  const previewContentRef = useRef();
  const imageSelectorRef = useRef();

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

  const handleModPost = async () => {
    const title = titleTextareaRef.current.value;
    let content = previewContentRef.current.outerHTML;

    const imgTags = previewContentRef.current.querySelectorAll("img");
    for (let img of imgTags) {
      if (img.src.startsWith("data:image/")) {
        const imgUrl = await uploadImage(img.src);
        content = content.replace(img.src, imgUrl);
      }
    }
    axios
      .put(`/api/articles/${publisher}/${articleID}`, {
        title: title,
        content: content,
      })
      .then((res) => {
        console.log(res.data);
        document.querySelector(".headerContainer").classList.remove("hide");
      })
      .catch((e) => console.error(e));
  };

  const errCheck = () => {
    if (
      previewContentRef.current.innerHTML === "" ||
      titleTextareaRef.current.value === ""
    ) {
      setIsError(true);
    } else {
      setIsError(false);
    }
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const showAlertPopUp = () => {
    const alertSaveRef = document.querySelector(".alertSave");
    alertSaveRef.style.display = "flex";
    setTimeout(() => {
      alertSaveRef.style.display = "none";
    }, 2000);
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

    const sel = window.getSelection();
    // 현재 선택된 커서 위치를 가져옴.
    if (sel.rangeCount) {
      const range = sel.getRangeAt(0);

      range.insertNode(imgTag);

      // 이미지 뒤로 커서 설정
      range.setStartAfter(imgTag);
      range.collapse(true);
      sel.removeAllRanges();
      sel.addRange(range);
    } else {
      // 선택된 커서 영역이 없는 경우, 그냥 마지막에 추가
      contentTextareaRef.current.appendChild(imgTag);
    }
  };

  useEffect(() => {
    axios
      .get(`/api/articles/${publisher}/${articleID}`)
      .then((res) => setArticle(res.data))
      .catch((e) => console.error("Error Occured on load ModPage :: " + e));
  }, []);

  useEffect(() => {
    if (article !== undefined) {
      titleTextareaRef.current.innerText = article.title;
      const contentElement = new DOMParser()
        .parseFromString(article.content, "text/html")
        .querySelector("div");

      console.log(contentElement);

      contentTextareaRef.current.innerHTML = contentElement.innerHTML;
      handleTitleChange();
      handleContentChange();
    }
  }, [article]);

  return (
    <section className={"writeContainer"}>
      <Modal isOpen={showModal} className="loadSaveModalContainer">
        <span className="title">임시 포스트 불러오기</span>
        <span className="content">임시저장된 포스트를 불러오시겠습니까?</span>
        <div className="functions">
          <span className="no" onClick={closeModal}>
            취소
          </span>
          <span className="ok">확인</span>
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
            ref={imageSelectorRef}
            className="imageSelector hide"
            type="file"
            accept="image/*"
            onChange={() => {
              const url = uploadImage();
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
            <button className={"buttonSave"}>임시저장</button>
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
        <div ref={previewContentRef} className={"previewContent"} />
      </section>
    </section>
  );
}
