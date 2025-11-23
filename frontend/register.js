document.getElementById("registerForm").addEventListener("submit", async (e) => {
    e.preventDefault();
  
    const name = e.target.name.value;
    const email = e.target.email.value;
    const password = e.target.password.value;
    const confirmPassword = e.target.confirmPassword.value;
  
    if (password !== confirmPassword) {
      document.getElementById("registerMessage").innerText = "Passwords do not match.";
      return;
    }
  
    try {
      const res = await fetch("http://localhost:3000/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });
  
      const text = await res.text();
      document.getElementById("registerMessage").innerText = text;
  
      if (res.ok) {
        e.target.reset();
        alert("Registration successful!");
        // Save user name to localStorage for session
        if (typeof saveUserNameToLocal === 'function') {
          saveUserNameToLocal(name);
        } else {
          localStorage.setItem('userName', name);
        }
        localStorage.setItem('isLoggedIn', 'true');
        window.location.href = "index.html";
      } else {
        alert("Registration failed: " + text);
      }
    } catch (err) {
      console.error(err);
      alert("Registration error");
    }
  });
  