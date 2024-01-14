import "./App.css";
import React, { useEffect, useState } from "react";
import {
  BrowserRouter,
  Link,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
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
import axios from "axios";
import PrivateRoute from "./lib/privateRoute";
function App() {
  const [access, setAccess] = useState(false);
  const [isLogin, setIsLogin] = useState(false);
  const [location, setLocation] = useState("/");

  useEffect(() => {
    console.log("현재 로그인 상태 : ", isLogin);
    setAccess(isLogin);
  }, [isLogin]);

  useEffect(() => {
    console.log("현재 주소", location);
  }, [location]);

  return (
    <BrowserRouter>
      <div className="alertSave">
        <span className="content">포스트가 임시저장되었습니다.</span>
        <span className="closeButton">
          <FontAwesomeIcon icon={faClose} />
        </span>
      </div>
      <Header isLogin={isLogin} setIsLogin={setIsLogin} />
      <Routes>
        <Route index="/" element={<MainPage />} />
        <Route path="/recent" element={<RecentPage />} />
        <Route
          path="/post/:userNickName/:postId"
          element={
            <PostPage isLogin={isLogin} setIsLocaitonChange={setLocation} />
          }
        />
        <Route
          path="/write"
          element={
            <PrivateRoute authenticated={access} component={<WritePage />} />
          }
        />
        <Route
          path="/write/saved/:id"
          element={
            <PrivateRoute
              authenticated={access}
              component={<SaveWritePage />}
            />
          }
        />
        <Route
          path="/write/:userID/:id"
          element={
            <PrivateRoute authenticated={access} component={<ModPage />} />
          }
        />
        <Route
          path="/saves"
          element={
            <PrivateRoute authenticated={access} component={<SavePage />} />
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
