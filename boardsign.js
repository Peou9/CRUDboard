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
