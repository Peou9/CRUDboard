document.addEventListener("DOMContentLoaded", () => {
  const postId = Number(new URLSearchParams(location.search).get("id"));
  const posts = JSON.parse(localStorage.getItem("posts") || "[]");
  const post = posts.find((p) => p.id === postId);

  if (!post) {
    alert("글을 찾을 수 없습니다.");
    window.location.href = "index.html";
  }

  document.getElementById("edit-title").value = post.title;
  document.getElementById("edit-content").value = post.content;

  window.updatePost = function () {
    const title = document.getElementById("edit-title").value.trim();
    const content = document.getElementById("edit-content").value.trim();

    if (!title || !content) {
      alert("제목과 내용을 모두 입력해주세요.");
      return;
    }

    post.title = title;
    post.content = content;

    localStorage.setItem("posts", JSON.stringify(posts));
    alert("글이 수정되었습니다.");
    window.location.href = `boardview.html?id=${postId}`;
  };
});
