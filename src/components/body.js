import styles from "./body.module.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainPage from "./mainPage";
import RecentPage from "./recentPage";
export default function Body(props) {
  const { trendList, setTrendList, recentList, setRecentList } = props;

  return (
    <div>
      <section className="features">
        <Routes>
          <Route
            path="/"
            element={<MainPage list={trendList} setList={setTrendList} />}
          />
          <Route
            path="/recent"
            element={<RecentPage list={recentList} setList={setRecentList} />}
          />
        </Routes>
      </section>
    </div>
  );
}
