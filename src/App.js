import "./App.css";
import React, { useEffect, useState } from "react";
import { BrowserRouter, Link, Route, Routes } from "react-router-dom";
import WritePage from "./components/writePage";
import MainPage from "./components/mainPage";
import RecentPage from "./components/recentPage";
import PostPage from "./components/postPage";
import ModPage from "./components/modPage";
import Header from "./components/header";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClose } from "@fortawesome/free-solid-svg-icons";
import SavePage from "./components/savePage";
import SaveWritePage from "./components/saveWirtePage";
import Modal from "react-modal";
import axios from "axios";
function App() {
  const [postList, setPostList] = useState([]);
  const [isLogin, setIsLogin] = useState(false);
  const [USER, setUSER] = useState();
  const [accountList, setAccountList] = useState([]);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deletePostInfo, setDeletePostInfo] = useState();
  const [isChanged, setIsChanged] = useState();

  useEffect(() => {
    try {
      console.log("Current USER ::: " + USER.email);
    } catch {
      console.log("Not Logined");
    }
  }, USER);

  const deleteModalFunctions = {
    closeModal: () => {
      setIsDeleteModalOpen(false);
    },
    onClickButtonConfirm: () => {
      deleteModalFunctions.closeModal();
      console.log(deletePostInfo);
      axios
        .delete(
          `/api/articles/${deletePostInfo.publisher}/${deletePostInfo.articleID}`
        )
        .then((res) => {
          console.log(res);
        })
        .catch((err) => console.error(err));
    },
  };

  return (
    <BrowserRouter>
      <Modal
        className={"deleteModal"}
        isOpen={isDeleteModalOpen}
        onRequestClose={deleteModalFunctions.closeModal}
      >
        <span className={"modalTitle"}>포스트 삭제</span>
        <span className={"modalContent"}>정말로 삭제하시겠습니까?</span>
        <div className={"modalButtons"}>
          <button
            className={"buttonCancel"}
            onClick={deleteModalFunctions.closeModal}
          >
            {" "}
            취소
          </button>
          <Link
            to={"/"}
            className={"buttonConfirm"}
            onClick={deleteModalFunctions.onClickButtonConfirm}
          >
            확인
          </Link>
        </div>
      </Modal>
      <div className="alertSave">
        <span className="content">포스트가 임시저장되었습니다.</span>
        <span className="closeButton">
          <FontAwesomeIcon icon={faClose} />
        </span>
      </div>
      <div className="alertPopUP">
        <section className="contentSection">
          <span className="closeAlertButton">
            <FontAwesomeIcon icon={faClose} />
          </span>
          <span className="alertContent">잘못된 이메일 형식입니다.</span>
        </section>
        <div className="alertTimer" />
      </div>
      <Header
        setUSER={setUSER}
        isLogin={isLogin}
        setIsLogin={setIsLogin}
        accountList={accountList}
        setAccountList={setAccountList}
      />
      <Routes>
        <Route index="index" element={<MainPage isChanged={isChanged} />} />
        <Route path="/recent" element={<RecentPage />} />
        <Route
          path="/articles/:userID/:id"
          element={
            <PostPage
              USER={USER}
              setIsDeleteModalOpen={setIsDeleteModalOpen}
              setDeletePostInfo={setDeletePostInfo}
            />
          }
        />
        <Route
          path="/write"
          element={
            <WritePage
              USER={USER}
              accountList={accountList}
              postList={postList}
              setPostList={setPostList}
            />
          }
        />
        <Route
          path="/write/saved/:id"
          element={
            <SaveWritePage
              USER={USER}
              accountList={accountList}
              postList={postList}
              setPostList={setPostList}
            />
          }
        />
        <Route
          path="/write/:userID/:id"
          element={
            <ModPage
              USER={USER}
              accountList={accountList}
              postList={postList}
              setPostList={setPostList}
              setIsChanged={setIsChanged}
            />
          }
        />
        <Route path="/saves" element={<SavePage USER={USER} />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
