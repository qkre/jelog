import {
  faArrowDown,
  faClose,
  faMagnifyingGlass,
  faSun,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import Modal from "react-modal";
import { Link } from "react-router-dom";
import "./header.css";

export default function Header(props) {
  const { isLogin, setIsLogin, loginModalShow, setLoginModalShow } = props;

  const userInfo = JSON.parse(sessionStorage.getItem("userInfo"));

  const [modalState, setModalState] = useState("login");
  const [userEmail, setUserEmail] = useState();
  const [userPw, setUserPw] = useState();
  const [isRemember, setIsRemember] = useState(false);

  const writeButtonRef = useRef();
  const userIconButtonRef = useRef();
  const userMenuButtonRef = useRef();
  const loginButtonRef = useRef();
  const moreInfoSectionRef = useRef();
  const headerContainerRef = useRef();

  const modalTags = {
    title: useRef(),
    method: useRef(),
    mainButton: useRef(),
    subTitle: useRef(),
    message: useRef(),
    messageButton: useRef(),
    registerSuccessMessage: useRef(),
    userEmailInputRef: useRef(),
    userPwInputRef: useRef(),
    alertPopUP: useRef(),
  };

  useEffect(() => {
    Modal.setAppElement("#root");

    var token = "";
    var userEmail = "";
    if (sessionStorage.getItem("userEmail")) {
      userEmail = sessionStorage.getItem("userEmail");
      token = sessionStorage.getItem("token");
    } else {
      userEmail = localStorage.getItem("userEmail");
      token = localStorage.getItem("token");
    }

    if (token != null) {
      axios
        .get(`/api/private/user`, {
          params: {
            userEmail: userEmail,
            token: token,
          },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => {
          sessionStorage.setItem("userInfo", JSON.stringify(res.data));
          setIsLogin(true);
        })
        .catch((err) => {
          console.error(err);
          setIsLogin(false);
        });
    }
  }, []);

  const showLoginModal = () => {
    setLoginModalShow(true);
  };

  const onClickCloseModalButton = () => {
    setLoginModalShow(false);
    setIsLogin(false);
  };

  const onClickLoginButton = async () => {
    if (modalState === "login") {
      axios
        .post(`/api/public/user/login`, {
          userEmail: userEmail,
          userPw: userPw,
        })
        .then((res) => {
          console.log(res.data);
          const token = res.data.token;

          axios
            .get(`/api/private/user`, {
              params: {
                userEmail: userEmail,
                token: token,
              },
              headers: {
                Authorization: `Bearer ${token}`,
              },
            })
            .then(async (res) => {
              console.log(res.data);
              const userInfo = res.data;
              if (isRemember) {
                await localStorage.setItem("userEmail", userEmail);
                await localStorage.setItem("token", token);
                await localStorage.setItem(
                  "userInfo",
                  JSON.stringify(userInfo)
                );
              }
              await sessionStorage.setItem("userEmail", userEmail);
              await sessionStorage.setItem("token", token);
              await sessionStorage.setItem(
                "userInfo",
                JSON.stringify(userInfo)
              );

              window.location.reload();
              setIsLogin(true);
            })
            .catch((err) => {
              console.error(err);
            });

          setLoginModalShow(false);
        })
        .catch((err) => {
          console.log(err);
          showAlertPopUp(err.response.data);
        });
    } else {
      if (await isEmailVaild()) {
        console.log("회원가입 버튼 클릭");
        const userIcon =
          "#" + Math.floor(Math.random() * 0xffffff).toString(16);
        axios
          .post(`/api/public/user`, {
            userEmail: userEmail,
            userPw: userPw,
            userIcon: userIcon,
          })
          .then((res) => {
            console.log(res);
            modalTags.userEmailInputRef.current.style.backgroundColor =
              "var(--velog-white-green)";
            modalTags.userEmailInputRef.current.style.color =
              "var(--velog-green)";
            modalTags.userEmailInputRef.current.style.fontWeight = "600";

            modalTags.userEmailInputRef.current.value =
              "✔️ 회원가입 링크가 이메일로 전송되었습니다.";
            modalTags.userEmailInputRef.current.readOnly = "true";
            modalTags.userPwInputRef.current.style.display = "none";
            modalTags.mainButton.current.style.display = "none";
          })
          .catch((err) => {
            const message = err.response.data;
            console.error(err);
            showAlertPopUp(message);
          });
      } else {
        console.log("여기야");
        showAlertPopUp(`${userEmail} 은 이미 존재하는 계정입니다.`);
      }
    }
  };

  const isEmailVaild = async () => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^s@]+$/;
    var isUnique = false;
    await axios
      .get(`/api/public/user/valid`, {
        params: {
          userEmail: userEmail,
        },
      })
      .then((res) => {
        isUnique = true;
      })
      .catch((err) => {
        console.error(err);
      });

    if (isUnique) {
      return emailPattern.test(userEmail);
    }
    return false;
  };

  const showAlertPopUp = (message) => {
    const alertPopUP = document.querySelector(".alertPopUP");
    const alertContent = document.querySelector(
      ".alertPopUP .contentSection .alertContent"
    );
    alertContent.innerText = message;
    alertPopUP.style.display = "flex";
    setTimeout(() => {
      alertPopUP.style.display = "none";
    }, 2000);
  };

  const onClickLogoutButton = () => {
    setIsLogin(false);
    window.location.reload();
    moreInfoSectionRef.current.style.display = "none";
    localStorage.removeItem("userEmail");
    localStorage.removeItem("token");
    localStorage.removeItem("userInfo");
    sessionStorage.removeItem("userEmail");
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("userInfo");
    console.log("logoutButton Clicked");
  };

  const handleUserEmailChange = () => {
    setUserEmail(modalTags.userEmailInputRef.current.value);
  };

  const handleUserPWChange = () => {
    setUserPw(modalTags.userPwInputRef.current.value);
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
      // modalTags.subTitle.current.innerText = "소셜 계정으로 회원가입";
      modalTags.message.current.innerText = "계정이 이미 있으신가요?";
      modalTags.messageButton.current.innerText = "로그인";
    } else if (modalState === "register") {
      setModalState("login");
      modalTags.title.current.innerText = "로그인";
      modalTags.method.current.innerText = "이메일로 로그인";
      modalTags.mainButton.current.innerText = "로그인";
      // modalTags.subTitle.current.innerText = "소셜 계정으로 로그인";
      modalTags.message.current.innerText = "아직 회원이 아니신가요?";
      modalTags.messageButton.current.innerText = "회원가입";

      modalTags.userEmailInputRef.current.style.backgroundColor = "white";
      modalTags.userEmailInputRef.current.style.color = "black";
      modalTags.userEmailInputRef.current.style.fontWeight = "400";

      modalTags.userEmailInputRef.current.value = "";
      modalTags.userEmailInputRef.current.removeAttribute("readOnly");
      modalTags.userPwInputRef.current.value = "";
      modalTags.userPwInputRef.current.style.display = "";
      modalTags.mainButton.current.style.display = "";
    }

    console.log("현재 모달 창 상태 :: " + modalState);
  };

  const remeberCheck = (e) => {
    setIsRemember(e.target.checked);
  };

  return (
    <div ref={headerContainerRef} className="headerContainer">
      <Modal isOpen={loginModalShow} className="loginModal">
        <div className="alertPopUP">
          <section className="contentSection">
            <span className="closeAlertButton">
              <FontAwesomeIcon icon={faClose} />
            </span>
            <span className="alertContent">잘못된 이메일 형식입니다.</span>
          </section>
          <div className="alertTimer" />
        </div>
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
            {/* 로그인 인증 방법 아직 개발 안됨. 현재는 이메일 비밀번호로 로그인 */}
            <section className="loginInputSectionTemp">
              <input
                ref={modalTags.userEmailInputRef}
                className="userEmail"
                type="email"
                placeholder="이메일을 입력하세요."
                onChange={handleUserEmailChange}
              />
              <input
                ref={modalTags.userPwInputRef}
                className="userPw"
                type="password"
                placeholder="비밀번호를 입력하세요."
                onChange={handleUserPWChange}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    onClickLoginButton();
                  }
                }}
              />
              <span
                ref={modalTags.mainButton}
                to={"/"}
                className="buttonLogin"
                onClick={onClickLoginButton}
              >
                로그인
              </span>
              <label>
                <input type="checkbox" onClick={remeberCheck} />
                로그인 유지
              </label>
            </section>

            <span ref={modalTags.subTitle} className="loginSubTitle">
              소셜 계정으로 로그인
            </span>
            {/* <section className="loginMethodSection">
              <FontAwesomeIcon icon={faGithub} />
              <FontAwesomeIcon icon={faGoogle} />
              <FontAwesomeIcon icon={faFacebook} />
            </section> */}
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
            {!isLogin ? "jelog" : userInfo.userNickName + ".log"}
          </Link>
        </div>
        <div className={"buttons"}>
          <button className={"dayNight"}>
            <FontAwesomeIcon icon={faSun} />
          </button>
          <button className={"search"}>
            <FontAwesomeIcon icon={faMagnifyingGlass} />
          </button>
          {isLogin && (
            <Link
              ref={writeButtonRef}
              to="/write"
              className="newPost"
              onClick={() => {
                // headerContainerRef.current.classList.add("hide");
              }}
            >
              새 글 작성
            </Link>
          )}
          {isLogin && (
            <button
              ref={userIconButtonRef}
              className="userIcon"
              style={{
                backgroundColor: userInfo.userIcon,
              }}
            />
          )}
          {isLogin && (
            <button
              ref={userMenuButtonRef}
              className={"moreInfo"}
              onClick={onClickMoreInfoButton}
            >
              <FontAwesomeIcon icon={faArrowDown} />
            </button>
          )}
          {!isLogin && (
            <button
              ref={loginButtonRef}
              className="login"
              onClick={showLoginModal}
            >
              로그인
            </button>
          )}
        </div>
        <section ref={moreInfoSectionRef} className="moreInfoSection">
          <span className="buttonMyJelog">내 젤로그</span>
          <Link to={"/saves"} className="buttonTempPost">
            임시 글
          </Link>
          <span className="buttonReadList">읽기 목록</span>
          <span className="buttonSetting">설정</span>
          <span className="buttonLogout" onClick={onClickLogoutButton}>
            로그아웃
          </span>
        </section>
      </section>
    </div>
  );
}
