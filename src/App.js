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
import { faClose, faHeart } from "@fortawesome/free-solid-svg-icons";
import SavePage from "./components/savePage";
import SaveWritePage from "./components/saveWirtePage";
function App() {
  const [postList, setPostList] = useState([]);
  const [isLogin, setIsLogin] = useState(false);
  const [userID, setUserID] = useState();
  const [accountList, setAccountList] = useState([
    {
      userID: "t",
      account: "t",
      userIcon: "#232143",
    },
  ]);
  const [savePostList, setSavePostList] = useState([]);
  const [postID, setPostID] = useState(0);
  const [savePostID, setSavePostID] = useState(0);

  const trendingPostList = [...postList].sort(
    (a, b) => b.likesCount - a.likesCount
  );
  const recentPostList = [...postList].sort((a, b) => b.id - a.id);
  const trendingPosts = trendingPostList.map((item, index) => {
    const contentElement = new DOMParser()
      .parseFromString(item.content, "text/html")
      .querySelector("div");

    let thumbnailJSX;

    try {
      const thumbnail = contentElement.querySelector("img");

      thumbnailJSX = React.createElement("div", {
        dangerouslySetInnerHTML: {
          __html: thumbnail.outerHTML,
        },
      });
    } catch (err) {
      thumbnailJSX = React.createElement("div");
    }

    const firstContent = Array.from(contentElement.childNodes).find(
      (item) => item.nodeName === "#text"
    ).textContent;

    const userInfo = accountList.find((accountInfos) => {
      // console.log(accountInfos);
      return accountInfos.userID === item.userID;
    });

    return (
      <Link
        to={`/post/${item.userID}/${item.id}`}
        key={index}
        className="postBox"
      >
        <div className="innerBox">
          <div className="thumbnail">{thumbnailJSX}</div>
          <span className="title">{item.title}</span>
          <span className="content">{firstContent}</span>
        </div>
        <span className="date">{item.date}</span>
        <section className="infoSection">
          <div>
            <div
              className="userIcon"
              style={{ backgroundColor: `${userInfo.userIcon}` }}
            />
            <span className="userID">by {item.userID}</span>
          </div>
          <div className="likesCount">
            <FontAwesomeIcon icon={faHeart} />
            {item.likesCount}
          </div>
        </section>
      </Link>
    );
  });

  const recentPosts = recentPostList.map((item, index) => {
    const contentElement = new DOMParser()
      .parseFromString(item.content, "text/html")
      .querySelector("div");

    let thumbnailJSX;

    // console.log(contentElement);

    try {
      const thumbnail = contentElement.querySelector("img");

      thumbnailJSX = React.createElement("div", {
        dangerouslySetInnerHTML: {
          __html: thumbnail.outerHTML,
        },
      });
    } catch (err) {
      thumbnailJSX = React.createElement("div");
    }
    const userInfo = accountList.find((accountInfos) => {
      // console.log(accountInfos);
      return accountInfos.userID === item.userID;
    });

    const firstContent = Array.from(contentElement.childNodes).find(
      (item) => item.nodeName === "#text"
    ).textContent;

    return (
      <Link
        to={`/post/${item.userID}/${item.id}`}
        key={index}
        className="postBox"
      >
        <div className="innerBox">
          <div className="thumbnail">{thumbnailJSX}</div>
          <span className="title">{item.title}</span>
          <span className="content">{firstContent}</span>
        </div>
        <span className="date">{item.date}</span>
        <section className="infoSection">
          <div>
            <div
              className="userIcon"
              style={{ backgroundColor: `${userInfo.userIcon}` }}
            />
            <span className="userID">by {item.userID}</span>
          </div>
          <div className="likesCount">
            <FontAwesomeIcon icon={faHeart} />
            {item.likesCount}
          </div>
        </section>
      </Link>
    );
  });

  // useEffect(() => {
  //   console.log(postList);
  // }, [trendingPostList]);

  return (
    <BrowserRouter>
      <div className="alertSave">
        <span className="content"> 포스트가 임시저장되었습니다.</span>
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
        posts={postList}
        addPost={setPostList}
        isLogin={isLogin}
        setIsLogin={setIsLogin}
        userID={userID}
        setUserID={setUserID}
        accountList={accountList}
        setAccountList={setAccountList}
        savePostList={savePostList}
        setSavePostList={setSavePostList}
      />
      <Routes>
        <Route
          index="index"
          element={
            <MainPage
              postList={trendingPosts}
              setPostList={setPostList}
              isLogin={isLogin}
              setIsLogin={setIsLogin}
              userID={userID}
              setUserID={setUserID}
            />
          }
        />
        <Route
          path="/recent"
          element={
            <RecentPage
              postList={recentPosts}
              setPostList={setPostList}
              isLogin={isLogin}
              setIsLogin={setIsLogin}
              userID={userID}
              setUserID={setUserID}
            />
          }
        />
        <Route
          path="/post/:userID/:id"
          element={
            <PostPage
              postList={postList}
              setPostList={setPostList}
              userID={userID}
            />
          }
        />
        <Route
          path="/write"
          element={
            <WritePage
              postList={postList}
              setPostList={setPostList}
              isLogin={isLogin}
              setIsLogin={setIsLogin}
              userID={userID}
              setUserID={setUserID}
              savePostList={savePostList}
              setSavePostList={setSavePostList}
              postID={postID}
              setPostID={setPostID}
              savePostID={savePostID}
              setSavePostID={setSavePostID}
            />
          }
        />
        <Route
          path="/write/saved/:id"
          element={
            <SaveWritePage
              postID={postID}
              setPostID={setPostID}
              postList={postList}
              setPostList={setPostList}
              savePostList={savePostList}
              setSavePostList={setSavePostList}
            />
          }
        />
        <Route
          path="/write/:userID/:id"
          element={<ModPage postList={postList} setPostList={setPostList} />}
        />
        <Route
          path="/saves"
          element={
            <SavePage
              userID={userID}
              savePostList={savePostList}
              setSavePostList={setSavePostList}
            />
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
