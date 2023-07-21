import "./App.css";
import Header from "./components/header";
import Body from "./components/body";
import { useState } from "react";
import { BrowserRouter, useLocation } from "react-router-dom";
function App() {
  const [trendList, setTrendList] = useState([]);
  const [recentList, setRecentList] = useState([]);

  const trendPost = trendList.map((item, index) => {
    return (
      <div key={index} className="postBox">
        트렌딩 {index + 1}번째 포스트
      </div>
    );
  });

  const recentPost = recentList.map((item, index) => {
    return (
      <div key={index} className="postBox">
        최신 {index + 1}번째 포스트
      </div>
    );
  });

  const addTrendPost = () => {
    setTrendList([...trendList, "NewPost"]);
    console.log(trendList);
  };
  const addRecentPost = () => {
    setRecentList([...recentList, "NewPost"]);
    console.log(recentList);
  };

  return (
    <BrowserRouter>
      <div>
        <Header addTrendPost={addTrendPost} addRecentPost={addRecentPost} />
        <Body
          trendList={trendPost}
          setTrendList={addTrendPost}
          recentList={recentPost}
          setRecentList={addRecentPost}
        />
      </div>
    </BrowserRouter>
  );
}

export default App;
