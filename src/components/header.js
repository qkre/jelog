import React, { useEffect, useRef, useState } from "react";
import "./header.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSun,
  faMagnifyingGlass,
  faArrowDown,
  faClose,
} from "@fortawesome/free-solid-svg-icons";
import { Link, useNavigate } from "react-router-dom";
import Modal from "react-modal";
import {
  faFacebook,
  faGithub,
  faGoogle,
} from "@fortawesome/free-brands-svg-icons";

export default function Header(props) {
  const { setUSER, isLogin, setIsLogin, accountList, setAccountList } = props;
  const [showModal, setShowModal] = useState(false);
  const [modalState, setModalState] = useState("login");
  const [userID, setUserID] = useState();
  const writeButtonRef = useRef();
  const userIconButtonRef = useRef();
  const userMenuButtonRef = useRef();
  const loginButtonRef = useRef();
  const moreInfoSectionRef = useRef();
  const headerContainerRef = useRef();

  const navigate = useNavigate();

  const modalTags = {
    title: useRef(),
    method: useRef(),
    mainButton: useRef(),
    subTitle: useRef(),
    message: useRef(),
    messageButton: useRef(),
    registerSuccessMessage: useRef(),
    userIDInputRef: useRef(),
    alertPopUP: useRef(),
  };

  const showLoginModal = () => {
    setShowModal(true);
  };

  const onClickCloseModalButton = () => {
    setShowModal(false);
    setIsLogin(false);
  };

  const onClickLoginButton = () => {
    if (modalState === "login") {
      const result = accountList.find((item) => item.account === userID);
      if (result) {
        setUSER(result);
        setIsLogin(true);
        setUserID(result.userID);
        userIconButtonRef.current.style.backgroundColor = result.userIcon;
        setShowModal(false);
        localStorage.setItem("USER", JSON.stringify(result));
        navigate("/");
      } else {
        showAlertPopUp();
      }
    } else {
      if (isEmailVaild()) {
        modalTags.userIDInputRef.current.style.backgroundColor =
          "var(--velog-white-green)";
        modalTags.userIDInputRef.current.style.color = "var(--velog-green)";
        modalTags.userIDInputRef.current.style.fontWeight = "600";

        modalTags.userIDInputRef.current.value =
          "✔️ 회원가입 링크가 이메일로 전송되었습니다.";
        modalTags.userIDInputRef.current.readOnly = "true";
        modalTags.mainButton.current.style.display = "none";

        const userIcon =
          "#" + Math.floor(Math.random() * 0xffffff).toString(16);

        const newAccountList = [
          ...accountList,
          {
            userID: userID.split("@")[0],
            account: userID,
            userIcon: userIcon,
            postIndex: 0,
            posts: [],
            saveIndex: 0,
            savedPost: [],
          },
        ];

        setAccountList(newAccountList);
        localStorage.setItem("accountList", JSON.stringify(newAccountList));
        console.log(JSON.stringify(accountList));
      } else {
        console.log("올바른 이메일 형식이 아닙니다.");
        showAlertPopUp();
      }
    }
  };

  const isEmailVaild = () => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^s@]+$/;
    if (accountList.some((item) => item.account === userID)) return false;
    return emailPattern.test(userID);
  };

  const showAlertPopUp = () => {
    const alertPopUP = document.querySelector(".alertPopUP");
    alertPopUP.style.display = "flex";
    setTimeout(() => {
      alertPopUP.style.display = "none";
    }, 2000);
  };

  const onClickLogoutButton = () => {
    moreInfoSectionRef.current.style.display = "none";
    setIsLogin(false);
    setUSER(undefined);
    localStorage.removeItem("USER");
    console.log("logoutButton Clicked");
  };

  const handleUserIDChange = () => {
    setUserID(modalTags.userIDInputRef.current.value);
  };

  const onClickMoreInfoButton = () => {
    const curretState = moreInfoSectionRef.current.style.display;
    if (curretState !== "flex") {
      moreInfoSectionRef.current.style.display = "flex";
    } else {
      moreInfoSectionRef.current.style.display = "none";
    }
  };

  const onClickRegisterButton = () => {
    if (modalState === "login") {
      setModalState("register");
      modalTags.title.current.innerText = "회원가입";
      modalTags.method.current.innerText = "이메일로 회원가입";
      modalTags.mainButton.current.innerText = "회원가입";
      modalTags.subTitle.current.innerText = "소셜 계정으로 회원가입";
      modalTags.message.current.innerText = "계정이 이미 있으신가요?";
      modalTags.messageButton.current.innerText = "로그인";
    } else if (modalState === "register") {
      setModalState("login");
      modalTags.title.current.innerText = "로그인";
      modalTags.method.current.innerText = "이메일로 로그인";
      modalTags.mainButton.current.innerText = "로그인";
      modalTags.subTitle.current.innerText = "소셜 계정으로 로그인";
      modalTags.message.current.innerText = "아직 회원이 아니신가요?";
      modalTags.messageButton.current.innerText = "회원가입";

      modalTags.userIDInputRef.current.style.backgroundColor = "white";
      modalTags.userIDInputRef.current.style.color = "black";
      modalTags.userIDInputRef.current.style.fontWeight = "400";

      modalTags.userIDInputRef.current.value = "";
      modalTags.userIDInputRef.current.removeAttribute("readOnly");
      modalTags.mainButton.current.style.display = "";
    }

    console.log("현재 모달 창 상태 :: " + modalState);
  };

  useEffect(() => {
    console.log("현재 로그인 상태 : " + isLogin);
    writeButtonRef.current.classList.toggle("hide");
    userIconButtonRef.current.classList.toggle("hide");
    userMenuButtonRef.current.classList.toggle("hide");
    loginButtonRef.current.classList.toggle("hide");
  }, [isLogin]);

  return (
    <div ref={headerContainerRef} className="headerContainer">
      <Modal isOpen={showModal} className="loginModal">
        <div className="mainContainer">
          {" "}
          <section className="imageSection">
            <img
              src={require("../images/loginImage.png")}
              alt="Login Image"
              className="image"
            />
            <span className="welcomeMessage">환영합니다!</span>
          </section>
          <section className="loginSection">
            <div>
              <button
                className="buttonCloseModal"
                onClick={onClickCloseModalButton}
              >
                <FontAwesomeIcon icon={faClose} />
              </button>
            </div>
            <span ref={modalTags.title} className="loginTitle">
              로그인
            </span>
            <span ref={modalTags.method} className="loginMethod">
              이메일로 로그인
            </span>
            <setcion className="loginInputSection">
              <input
                ref={modalTags.userIDInputRef}
                className="userID"
                type="email"
                placeholder="이메일을 입력하세요."
                onChange={handleUserIDChange}
              />
              <span
                ref={modalTags.mainButton}
                to={"/"}
                className="buttonLogin"
                onClick={onClickLoginButton}
              >
                로그인
              </span>
            </setcion>
            <span ref={modalTags.subTitle} className="loginSubTitle">
              소셜 계정으로 로그인
            </span>
            <section className="loginMethodSection">
              <FontAwesomeIcon icon={faGithub} />
              <FontAwesomeIcon icon={faGoogle} />
              <FontAwesomeIcon icon={faFacebook} />
            </section>
            <section className="registerSection">
              <span ref={modalTags.message} className="registerMessage">
                아직 회원이 아니신가요?
              </span>
              <span
                ref={modalTags.messageButton}
                className="registerButton"
                onClick={onClickRegisterButton}
              >
                회원가입
              </span>
            </section>
          </section>
        </div>
      </Modal>
      <section className="header">
        <div className="logos">
          <Link className="logoImage">J</Link>
          <Link to={"/"} className={"logoString"}>
            {!isLogin ? "jelog" : userID + ".log"}
          </Link>
        </div>
        <div className={"buttons"}>
          <button className={"dayNight"}>
            <FontAwesomeIcon icon={faSun} />
          </button>
          <button className={"search"}>
            <FontAwesomeIcon icon={faMagnifyingGlass} />
          </button>
          <Link
            ref={writeButtonRef}
            to="/write"
            className="newPost"
            onClick={() => {
              headerContainerRef.current.classList.add("hide");
            }}
          >
            새 글 작성
          </Link>
          <button ref={userIconButtonRef} className="userIcon"></button>
          <button
            ref={userMenuButtonRef}
            className={"moreInfo"}
            onClick={onClickMoreInfoButton}
          >
            <FontAwesomeIcon icon={faArrowDown} />
          </button>
          <button
            ref={loginButtonRef}
            className="login hide"
            onClick={showLoginModal}
          >
            로그인
          </button>
        </div>
        <section ref={moreInfoSectionRef} className="moreInfoSection">
          <span className="buttonMyJelog">내 젤로그</span>
          <Link to={"/saves"} className="buttonTempPost">
            임시 글
          </Link>
          <span className="buttonReadList">읽기 목록</span>
          <span className="buttonSetting">설정</span>
          <Link to={"/"} className="buttonLogout" onClick={onClickLogoutButton}>
            로그아웃
          </Link>
        </section>
      </section>
    </div>
  );
}
