import { Link } from "react-router-dom";
import "./savePage.css";

export default function SavePage(props) {
  const { USER } = props;
  console.log(USER.savePosts);
  const savePosts = USER.savedPost.map((item) => {
    console.log(item);

    const contentElement = new DOMParser()
      .parseFromString(item.content, "text/html")
      .querySelector("div");

    console.log(contentElement);
    const firstContent = Array.from(contentElement.childNodes).find(
      (item) => item.nodeName === "#text"
    ).textContent;

    return (
      <Link
        to={`/write/saved/${item.id}`}
        className="savePost"
        onClick={() => {
          document.querySelector(".headerContainer").classList.add("hide");
        }}
      >
        <span className="title">{item.title}</span>
        <span className="content">{firstContent}</span>
        <section className="functions">
          <span className="date">{item.date}</span>
          <span className="deleteButton">삭제</span>
        </section>
      </Link>
    );
  });

  return (
    <section className="SavePageContainer">
      <div className="title">임시 글 목록</div>
      {savePosts}
    </section>
  );
}
