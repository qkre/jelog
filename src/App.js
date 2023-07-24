import "./App.css";
import { useEffect, useState } from "react";
import { BrowserRouter, Link, Route, Routes } from "react-router-dom";
import WritePage from "./components/writePage";
import MainPage from "./components/mainPage";
import RecentPage from "./components/recentPage";
import PostPage from "./components/postPage";
import ModPage from "./components/modPage";
import Header from "./components/header";
function App() {
  const [postList, setPostList] = useState([]);
  const [isLogin, setIsLogin] = useState(false);
  const [userID, setUserID] = useState();

  const trendingPostList = [...postList].sort(
    (a, b) => b.likesCount - a.likesCount
  );
  const recentPostList = [...postList].sort((a, b) => b.id - a.id);

  const trendingPosts = trendingPostList.map((item, index) => {
    return (
      <Link
        to={`/post/${item.userID}/${item.id}`}
        key={index}
        className="postBox"
      >
        <div className="innerBox">
          <div className="thumbnail">THUMBNAIL</div>
          <span className="title">{item.title}</span>
          <span className="content">{item.content}</span>
        </div>
        <span className="date">{item.date}</span>
      </Link>
    );
  });

  const recentPosts = recentPostList.map((item, index) => {
    return (
      <Link
        to={`/post/${item.userID}/${item.id}`}
        key={index}
        className="postBox"
      >
        <div className="innerBox">
          <div className="thumbnail">THUMBNAIL</div>
          <span className="title">{item.title}</span>
          <span className="content">{item.content}</span>
        </div>
        <span className="date">{item.date}</span>
      </Link>
    );
  });

  useEffect(() => {
    console.log(postList);
  }, [trendingPostList]);

  return (
    <BrowserRouter>
      <div className="container">
        <Header
          posts={postList}
          addPost={setPostList}
          isLogin={isLogin}
          setIsLogin={setIsLogin}
          userID={userID}
          setUserID={setUserID}
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
            path="/write"
            element={
              <WritePage
                postList={postList}
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
            path="/write/:userID/:id"
            element={
              <ModPage
                postList={postList}
                setPostList={setPostList}
                userID={userID}
              />
            }
          />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
