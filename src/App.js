import "./App.css";
import React, { useEffect, useReducer, useState } from "react";
import { BrowserRouter, Link, Route, Routes, json } from "react-router-dom";
import WritePage from "./components/writePage";
import MainPage from "./components/mainPage";
import RecentPage from "./components/recentPage";
import PostPage from "./components/postPage";
import ModPage from "./components/modPage";
import Header from "./components/header";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClose, faHeart } from "@fortawesome/free-solid-svg-icons";
import SavePage from "./components/savePage";
import SaveWritePage from "./components/saveWirtePage";
import axios from "axios";
function App() {
  const [postList, setPostList] = useState([]);
  const [isLogin, setIsLogin] = useState(false);
  const [USER, setUSER] = useState();
  const [accountList, setAccountList] = useState([]);

  return (
    <BrowserRouter>
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
        <Route index="index" element={<MainPage />} />
        <Route path="/recent" element={<RecentPage />} />
        <Route
          path="/articles/:userID/:id"
          element={
            <PostPage
              USER={USER}
              accountList={accountList}
              postList={postList}
              setPostList={setPostList}
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
            />
          }
        />
        <Route path="/saves" element={<SavePage USER={USER} />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
