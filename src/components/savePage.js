import { Link } from "react-router-dom";
import "./savePage.css";

export default function SavePage(props) {
  const { userID, savePostList, setSavePostList } = props;
  console.log(savePostList);
  const savePosts = savePostList.map((item) => {
    if (item !== undefined && item.userID === userID) {
      console.log(item);

      const contentElement = new DOMParser()
        .parseFromString(item.content, "text/html")
        .querySelector("div");

      console.log(contentElement);
      const firstContent = Array.from(contentElement.childNodes).find(
        (item) => item.nodeName === "#text"
      ).textContent;

      return (
        <Link to={`/write/saved/${item.id}`} className="savePost">
          <span className="title">{item.title}</span>
          <span className="content">{firstContent}</span>
          <section className="functions">
            <span className="date">{item.date}</span>
            <span className="deleteButton">삭제</span>
          </section>
        </Link>
      );
    }
  });

  return (
    <section className="SavePageContainer">
      <div className="title">임시 글 목록</div>
      {savePosts}
    </section>
  );
}
