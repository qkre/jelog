import { useEffect, useRef, useState } from "react";
import "./writePage.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faImage,
  faLink,
  faQuoteRight,
} from "@fortawesome/free-solid-svg-icons";
import { Link, useLocation } from "react-router-dom";
import Modal from "react-modal";
import axios from "axios";
import imageCompression from "browser-image-compression";

export default function ModPage(props) {
  const URL = "http://118.67.132.220:8080";

  const [showModal, setShowModal] = useState(false);
  const [article, setArticle] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [tagList, setTagList] = useState([]);
  const [tagElement, setTagElement] = useState([]);

  const publisher = useLocation().pathname.split("/")[2];
  const articleID = parseInt(useLocation().pathname.split("/")[3]);

  const tagTextareaRef = useRef();
  const titleTextareaRef = useRef();
  const contentTextareaRef = useRef();
  const previewTitleRef = useRef();
  const previewContentRef = useRef();
  const imageSelectorRef = useRef();

  const deleteTag = (e) => {
    const modifiedTagList = tagList.filter((tag) => tag !== e.target.innerText);
    console.log(modifiedTagList);
    setTagList(modifiedTagList);
  };

  const handleTagChange = () => {
    const tags = tagTextareaRef.current.value.split(" ");
    const mergedTagList = [...tagList, ...tags];
    const uniqueTagList = [...new Set(mergedTagList)];
    setTagList(uniqueTagList);
    tagTextareaRef.current.value = "";
  };

  useEffect(() => {
    const newTagElement = tagList.map((tag) => {
      return (
        <div className="tag" onClick={deleteTag}>
          {tag}
        </div>
      );
    });
    setTagElement(newTagElement);
  }, [tagList]);

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
    console.log(tagList.toString());
    axios
      .put(`${URL}/api/articles/${publisher}/${articleID}`, {
        title: title,
        content: content,
        tags: tagList.toString(),
      })
      .then((res) => {
        console.log(res.data);
        document.querySelector(".headerContainer").classList.remove("hide");
      })
      .catch((e) => console.error(e));
  };

  const closeModal = () => {
    setShowModal(false);
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
        const response = await axios.post(`${URL}/api/uploadImage`, formData, {
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

  useEffect(() => {
    axios
      .get(`${URL}/api/articles/${publisher}/${articleID}`)
      .then((res) => setArticle(res.data))
      .catch((e) => console.error("Error Occured on load ModPage :: " + e));
  }, []);

  useEffect(() => {
    if (article !== undefined) {
      titleTextareaRef.current.innerText = article.title;
      const contentElement = new DOMParser()
        .parseFromString(article.content, "text/html")
        .querySelector("div");

      contentTextareaRef.current.innerHTML = contentElement.innerHTML;
      setTagList(article.tags.split(","));
      handleTitleChange();
      handleContentChange();
    }
  }, [article]);

  return (
    <section className={"writeContainer"}>
      {isLoading && (
        <div className="loadingSpinner">
          <span className="loadingText">Uploading..</span>
        </div>
      )}
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
          <section className="tagSection">{tagElement}</section>
          <input
            ref={tagTextareaRef}
            className={"tagInput"}
            type="textarea"
            placeholder="태그를 입력하세요."
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleTagChange();
              }
            }}
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
