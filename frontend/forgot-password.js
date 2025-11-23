document.getElementById("forgotForm").addEventListener("submit", async (e) => {
    e.preventDefault();
  
    const email = e.target.email.value;
    const newPassword = e.target.newPassword.value;
  
    try {
      const res = await fetch("http://localhost:5000/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, newPassword }),
      });
  
      const text = await res.text();
      document.getElementById("forgotMessage").innerText = text;
  
      if (res.ok) {
        alert("Password reset successful!");
        window.location.href = "login.html";
      } else {
        alert("Reset failed: " + text);
      }
    } catch (err) {
      console.error(err);
      alert("Error resetting password");
    }
  });
  