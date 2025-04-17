function submitPost() {
  const title = document.getElementById("title").value.trim();
  const author = document.getElementById("author").value.trim();
  const content = document.getElementById("content").value.trim();

  if (!title || !author || !content) {
    alert("제목, 작성자, 내용을 모두 입력해주세요.");
    return;
  }

  const posts = JSON.parse(localStorage.getItem("posts") || "[]");
  const id = Number(localStorage.getItem("postId") || "1");
  const date = new Date().toLocaleDateString();

  const newPost = {
    id,
    title,
    author,
    content,
    date,
    recommend: 0,
  };

  posts.push(newPost);
  localStorage.setItem("posts", JSON.stringify(posts));
  localStorage.setItem("postId", id + 1);

  alert("글이 등록되었습니다.");
  window.location.href = "index.html";
}
