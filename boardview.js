let postId = null;
let posts = [];
let currentUser = localStorage.getItem("loggedInUser");

function getQueryParam(param) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(param);
}

function showPost() {
  postId = Number(getQueryParam("id"));
  posts = JSON.parse(localStorage.getItem("posts") || "[]");
  const post = posts.find((p) => p.id === postId);

  const detailDiv = document.getElementById("post-detail");

  if (!post) {
    detailDiv.innerHTML = "<p>해당 글을 찾을 수 없습니다.</p>";
    return;
  }

  detailDiv.innerHTML = `
    <div class="post-title">${post.title}</div>
    <div class="post-meta">${post.author} | ${post.date}</div>
    <p><strong>추천수:</strong> <span id="recommend-count">${
      post.recommend
    }</span></p>
    <div class="post-content">${(post.content || "").replace(
      /\n/g,
      "<br>"
    )}</div>
  `;

  if (currentUser && currentUser === post.author) {
    const editBtn = document.createElement("button");
    editBtn.textContent = "수정";
    editBtn.style.marginTop = "10px";
    editBtn.onclick = () => {
      window.location.href = `boardedit.html?id=${post.id}`;
    };
    detailDiv.appendChild(editBtn);
  }

  const deleteBtn = document.createElement("button");
  deleteBtn.textContent = "삭제";
  deleteBtn.onclick = () => {
    if (confirm("이 글을 삭제하시겠습니까?")) {
      deletePost(post.id);
    }
  };
  detailDiv.appendChild(deleteBtn);
}

function deletePost(id) {
  const posts = JSON.parse(localStorage.getItem("posts") || "[]");
  const updatedPosts = posts.filter((post) => post.id !== id);
  localStorage.setItem("posts", JSON.stringify(updatedPosts));
  alert("글이 삭제되었습니다.");
  window.location.href = "index.html";
}

function recommendPost() {
  const post = posts.find((p) => p.id === postId);
  if (!post) return;
  post.recommend += 1;
  localStorage.setItem("posts", JSON.stringify(posts));
  document.getElementById("recommend-count").textContent = post.recommend;
}

function loadComments() {
  const commentList = document.getElementById("comment-list");
  const comments = JSON.parse(
    localStorage.getItem(`comments_${postId}`) || "[]"
  );
  commentList.innerHTML = "";

  if (comments.length === 0) {
    commentList.innerHTML = "<p>아직 댓글이 없습니다.</p>";
    return;
  }

  comments.forEach((comment, index) => {
    const div = document.createElement("div");
    div.style.marginBottom = "8px";
    div.innerHTML = `
      <strong>${comment.author}</strong> (${comment.date}): ${comment.text}
    `;

    if (currentUser && currentUser === comment.author) {
      const delBtn = document.createElement("button");
      delBtn.textContent = "삭제";
      delBtn.style.marginLeft = "10px";
      delBtn.onclick = () => deleteComment(index);
      div.appendChild(delBtn);
    }

    commentList.appendChild(div);
  });
}

function addComment() {
  const input = document.getElementById("comment-input");
  if (!currentUser) {
    alert("로그인 후 댓글을 작성할 수 있습니다.");
    return;
  }
  if (!input) return;

  const text = input.value.trim();
  if (!text) {
    alert("댓글을 입력해주세요.");
    return;
  }

  const comments = JSON.parse(
    localStorage.getItem(`comments_${postId}`) || "[]"
  );
  const newComment = {
    author: currentUser,
    text,
    date: new Date().toLocaleDateString(),
  };

  comments.push(newComment);
  localStorage.setItem(`comments_${postId}`, JSON.stringify(comments));
  input.value = "";
  loadComments();
}

function deleteComment(index) {
  const comments = JSON.parse(
    localStorage.getItem(`comments_${postId}`) || "[]"
  );
  if (comments[index].author !== currentUser) {
    alert("본인이 작성한 댓글만 삭제할 수 있습니다.");
    return;
  }

  if (confirm("댓글을 삭제하시겠습니까?")) {
    comments.splice(index, 1);
    localStorage.setItem(`comments_${postId}`, JSON.stringify(comments));
    loadComments();
  }
}

window.onload = () => {
  showPost();
  loadComments();

  const commentInput = document.getElementById("comment-input");
  const commentSubmit = document.getElementById("comment-submit");
  const commentUser = document.getElementById("comment-user");

  if (currentUser) {
    commentUser.textContent = `댓글 작성자: ${currentUser}`;
    commentInput.disabled = false;
    commentSubmit.disabled = false;
  } else {
    commentUser.textContent = "로그인한 사용자만 댓글을 작성할 수 있습니다.";
    commentInput.disabled = true;
    commentSubmit.disabled = true;
  }
};
