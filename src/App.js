import React, { useEffect, useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import MainPage from "./components/mainPage";
import ModPage from "./components/modPage";
import PostPage from "./components/postPage";
import RecentPage from "./components/recentPage";
import SavePage from "./components/savePage";
import SaveWritePage from "./components/saveWirtePage";
import WritePage from "./components/writePage";
import PrivateRoute from "./lib/privateRoute";
function App() {
  const [loginModalShow, setLoginModalShow] = useState(false);
  const [isLogin, setIsLogin] = useState(false);
  const [location, setLocation] = useState();

  useEffect(() => {
    console.log(location);
  }, [location]);

  return (
    <BrowserRouter>
      <Routes>
        <Route
          index="/"
          element={
            <MainPage
              isLogin={isLogin}
              setIsLogin={setIsLogin}
              loginModalShow={loginModalShow}
              setLoginModalShow={setLoginModalShow}
            />
          }
        />
        <Route path="/recent" element={<RecentPage />} />
        <Route
          path="/post/:userNickName/:postId"
          element={
            <PostPage
              isLogin={isLogin}
              setIsLogin={setIsLogin}
              loginModalShow={loginModalShow}
              setLoginModalShow={setLoginModalShow}
              setIsLocaitonChange={setLocation}
            />
          }
        />
        <Route
          path="/write"
          element={
            <PrivateRoute authenticated={isLogin} component={<WritePage />} />
          }
        />
        <Route
          path="/write/saved/:id"
          element={
            <PrivateRoute
              authenticated={isLogin}
              component={<SaveWritePage />}
            />
          }
        />
        <Route
          path="/write/:userID/:id"
          element={
            <PrivateRoute authenticated={isLogin} component={<ModPage />} />
          }
        />
        <Route
          path="/saves"
          element={
            <PrivateRoute authenticated={isLogin} component={<SavePage />} />
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
