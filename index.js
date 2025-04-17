let posts = [];
let id = 1;
let currentPage = 1;
const pageSize = 10;

window.onload = () => {
  const currentUser = localStorage.getItem("loggedInUser");
  const loginUser = document.getElementById("login-user");
  const loginLink = document.getElementById("login-link");
  const logoutBtn = document.getElementById("logout-btn");
  const writeLink = document.getElementById("write-link");
  const searchInput = document.getElementById("search-input");

  if (currentUser) {
    loginUser.textContent = `${currentUser}님 반갑습니다!`;
    loginLink.style.display = "none";
    logoutBtn.style.display = "inline-block";
    writeLink.style.display = "inline-block";
  } else {
    loginUser.textContent = "로그인하지 않았습니다.";
    loginLink.style.display = "inline-block";
    logoutBtn.style.display = "none";
    writeLink.style.display = "none";
  }

  logoutBtn.onclick = () => {
    localStorage.removeItem("loggedInUser");
    alert("로그아웃되었습니다.");
    window.location.href = "index.html";
  };

  searchInput.addEventListener("input", renderBoard);

  renderBoard();
};

function renderBoard() {
  posts = JSON.parse(localStorage.getItem("posts") || "[]");
  const tbody = document.querySelector("#board tbody");
  const keyword =
    document.getElementById("search-input")?.value.toLowerCase() || "";

  const filteredPosts = posts.filter((post) =>
    post.title.toLowerCase().includes(keyword)
  );

  const start = (currentPage - 1) * pageSize;
  const end = start + pageSize;
  const paginatedPosts = filteredPosts.slice(start, end);

  tbody.innerHTML = "";

  paginatedPosts.forEach((post, index) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${filteredPosts.length - (start + index)}</td>
      <td><a href="boardview.html?id=${post.id}">${post.title}</a></td>
      <td>${post.author}</td>
      <td>${post.date}</td>
      <td>${post.recommend}</td>
    `;
    tbody.appendChild(row);
  });

  renderPagination(filteredPosts.length);
}

function renderPagination(totalPosts) {
  const paginationDiv = document.getElementById("pagination");
  const totalPages = Math.ceil(totalPosts / pageSize);
  paginationDiv.innerHTML = "";

  for (let i = 1; i <= totalPages; i++) {
    const btn = document.createElement("button");
    btn.textContent = i;
    btn.style.margin = "0 5px";
    btn.disabled = i === currentPage;
    btn.onclick = () => {
      currentPage = i;
      renderBoard();
    };
    paginationDiv.appendChild(btn);
  }
}

function recommendPost(postId) {
  const post = posts.find((p) => p.id === postId);
  if (!post) return;
  post.recommend += 1;
  localStorage.setItem("posts", JSON.stringify(posts));
  renderBoard();
}

function registerUser() {
  const username = document.getElementById("signup-username").value.trim();
  const password = document.getElementById("signup-password").value;

  if (!username || !password) {
    alert("모든 필드를 입력해주세요.");
    return;
  }

  const users = JSON.parse(localStorage.getItem("users") || "[]");
  const exists = users.find((user) => user.username === username);

  if (exists) {
    alert("이미 존재하는 사용자입니다.");
    return;
  }

  users.push({ username, password });
  localStorage.setItem("users", JSON.stringify(users));
  alert("회원가입 완료! 로그인 해주세요.");
  window.location.href = "boradsign.html";
}

function loginUser() {
  const username = document.getElementById("login-username").value.trim();
  const password = document.getElementById("login-password").value;

  const users = JSON.parse(localStorage.getItem("users") || "[]");
  const user = users.find(
    (u) => u.username === username && u.password === password
  );

  if (user) {
    localStorage.setItem("loggedInUser", username);
    alert("로그인 성공!");
    window.location.href = "index.html";
  } else {
    alert("아이디 또는 비밀번호가 올바르지 않습니다.");
  }
}
