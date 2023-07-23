import "./App.css";
import { useEffect, useState } from "react";
import { BrowserRouter, Link, Route, Routes } from "react-router-dom";
import WritePage from "./components/writePage";
import MainPage from "./components/mainPage";
import RecentPage from "./components/recentPage";
import PostPage from "./components/postPage";
import ModPage from "./components/modPage";
function App() {
  const [postList, setPostList] = useState([]);

  const trendingPostList = [...postList].sort(
    (a, b) => b.likesCount - a.likesCount
  );
  const recentPostList = [...postList].sort((a, b) => b.id - a.id);

  const trendingPosts = trendingPostList.map((item, index) => {
    return (
      <Link to={`/post/${item.id}`} key={index} className="postBox">
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
      <Link to={`/post/${item.id}`} key={index} className="postBox">
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
        <Routes>
          <Route
            index="index"
            element={<MainPage posts={trendingPosts} addPost={setPostList} />}
          />
          <Route
            path="/recent"
            element={<RecentPage posts={recentPosts} addPost={setPostList} />}
          />
          <Route
            path="/write"
            element={<WritePage posts={postList} addPost={setPostList} />}
          />
          <Route
            path="/post/:id"
            element={<PostPage posts={postList} setPost={setPostList} />}
          />
          <Route
            path="/write/:id"
            element={<ModPage posts={postList} setPost={setPostList} />}
          />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
