import "./App.css";
import { useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import WritePage from "./components/writePage";
import MainPage from "./components/mainPage";
import RecentPage from "./components/recentPage";
function App() {
  const [postList, setPostList] = useState([]);

  const posts = postList.map((item, index) => {
    return (
      <div key={index} className="postBox">
        <div className="innerBox">
          <div className="thumbnail">THUMBNAIL</div>
          <span className="title">{item.title}</span>
          <span className="content">{item.content}</span>
        </div>
        <span className="date">{item.date}</span>
      </div>
    );
  });

  console.log(postList);

  return (
    <BrowserRouter>
      <div className="container">
        <Routes>
          <Route
            path="/write"
            element={<WritePage posts={postList} addPost={setPostList} />}
          />
          <Route
            path="/"
            element={<MainPage posts={posts} addPost={setPostList} />}
          />
          <Route
            path="/recent"
            element={<RecentPage posts={posts} addPost={setPostList} />}
          />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
