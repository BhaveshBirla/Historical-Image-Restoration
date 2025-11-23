document.getElementById("loginForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = e.target.email.value.trim();
  const password = e.target.password.value.trim();
  const messageEl = document.getElementById("loginMessage");

  messageEl.innerText = "Logging in...";

  try {
    const res = await fetch("/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();
    console.log("Login response:", data);

    if (!data.success) {
      messageEl.innerText = data.message || "Login failed";
      alert("Login failed: " + (data.message || "Unknown error"));
      return;
    }

    // ✅ Mark user as logged in
    localStorage.setItem("isLoggedIn", "true");

    // ✅ Store user email for uploads & gallery
    const userEmail =
      (data.user && data.user.email) ||
      data.email ||
      email; // fallback to form email
    localStorage.setItem("userEmail", userEmail);

    // ✅ Optional: store user name
    let userName =
      (data.user && data.user.name) ||
      data.name ||
      localStorage.getItem("userName") ||
      "";

    if (typeof saveUserNameToLocal === "function") {
      saveUserNameToLocal(userName);
    } else if (userName) {
      localStorage.setItem("userName", userName);
    }

    messageEl.innerText = "Login successful! Redirecting...";
    e.target.reset();
    alert("Login successful!");

    window.location.href = "index.html";
  } catch (err) {
    console.error(err);
    messageEl.innerText = "Login error. Please try again.";
    alert("Login error");
  }
});
