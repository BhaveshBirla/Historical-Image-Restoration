// --- Upload and Clean Buttons Logic ---
const fileInput = document.getElementById("fileInput");
const uploadBtn = document.getElementById("uploadBtn");
const cleanBtn = document.getElementById("cleanBtn");
const container = document.getElementById("images");
const fileInputLabel = document.querySelector('label[for="fileInput"]');
const originalLabelText = fileInputLabel ? fileInputLabel.textContent : '';
let uploadedFile = null;

// Update label text on file selection
if (fileInput && fileInputLabel) {
    fileInput.addEventListener('change', function () {
        if (fileInput.files && fileInput.files[0]) {
            fileInputLabel.textContent = fileInput.files[0].name;
        } else {
            fileInputLabel.textContent = originalLabelText;
        }
    });
}


// Handle Upload button
uploadBtn.addEventListener("click", () => {
    if (fileInput.files && fileInput.files[0]) {
        uploadedFile = fileInput.files[0];
        const fileURL = URL.createObjectURL(uploadedFile);
        container.innerHTML = "";
        const card = document.createElement("div");
        card.className = "image-card";
        card.innerHTML = `
      <div>
        <div class="image-label">Original</div>
        <img class="image-preview" src="${fileURL}" alt="Original Image"/>
      </div>
      <div>
        <div class="image-label">Cleaned</div>
        <div class="image-spinner"></div>
      </div>
    `;
        container.appendChild(card);
        cleanBtn.disabled = false;
    } else {
        alert("Please select an image to upload.");
        cleanBtn.disabled = true;
        container.innerHTML = "";
    }
});

// Handle Restore button
cleanBtn.addEventListener("click", async () => {
    if (!uploadedFile) {
        alert("Please upload an image first.");
        return;
    }
    // Show spinner in Cleaned card
    const card = container.querySelector('.image-card');
    if (card) {
        const cleanedDiv = card.children[1];
        cleanedDiv.innerHTML = `
      <div class="image-label">Restored</div>
      <div class="image-spinner"><div class="loader"></div></div>
    `;
    }
    // Prepare FormData
    const formData = new FormData();
    formData.append("image", uploadedFile);

    // Send to server
    const userEmail = localStorage.getItem("userEmail");

    const res = await fetch("http://localhost:3000/upload", {
        method: "POST",
        headers: {
            "x-user-email": userEmail || "",
        },
        body: formData,
    });


    const data = await res.json();
    if (data.success && data.images && data.images.length > 0) {
        // Replace spinner with cleaned image and add Download button
        if (card) {
            const cleanedDiv = card.children[1];
            // Check login status
            const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
            cleanedDiv.innerHTML = `
        <div class="image-label">Restored</div>
        <img class="image-preview" src="${data.images[0].cleanedUrl}" alt="Restored Image"/>
        <button id="downloadBtn" class="download-btn" ${isLoggedIn ? '' : 'disabled'}>Download</button>
      `;
            // Add event listener for download
            const downloadBtn = document.getElementById('downloadBtn');
            if (downloadBtn) {
                downloadBtn.addEventListener('click', function () {
                    if (!isLoggedIn) {
                        alert('Please log in to download the restored image.');
                        return;
                    }
                    // Download logic
                    const link = document.createElement('a');
                    link.href = `${data.images[0].cleanedUrl}`;
                    link.download = 'restored-image.png';
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                });
            }
        }
    } else {
        alert("Error: " + (data.message || "Unknown error"));
        // Optionally, remove spinner or show error in UI
    }
});

// Dark / Light Mode Toggle
const toggleButton = document.getElementById("modeToggle");

// Apply theme based on localStorage or system preference
function applyTheme(theme) {
    if (theme === "dark") {
        document.body.classList.add("dark");
        toggleButton.innerText = "☀️ Light Mode";
        toggleButton.setAttribute("aria-pressed", "true");
    } else {
        document.body.classList.remove("dark");
        toggleButton.innerText = "🌙 Dark Mode";
        toggleButton.setAttribute("aria-pressed", "false");
    }
}

function getPreferredTheme() {
    const saved = localStorage.getItem("theme");
    if (saved) return saved;
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function toggleTheme() {
    const isDark = document.body.classList.toggle("dark");
    const theme = isDark ? "dark" : "light";
    localStorage.setItem("theme", theme);
    applyTheme(theme);
}

toggleButton.addEventListener("click", toggleTheme);

// On load
applyTheme(getPreferredTheme());

// Scroll to About/Contact
function scrollToSection(id) {
    document.getElementById(id).scrollIntoView({ behavior: "smooth" });
}

// Modal Open for Login / Signup
function openModal(type) {
    const modal = document.getElementById('modal');
    const content = document.getElementById('modalContent');

    if (type === 'login') {
        content.innerHTML = `
          <h2>Login</h2>
          <input type="text" placeholder="Email">
          <input type="password" placeholder="Password">
          <button onclick="closeModal()">Login</button>
        `;
    } else {
        content.innerHTML = `
          <h2>Signup</h2>
          <input type="text" placeholder="Name">
          <input type="email" placeholder="Email">
          <input type="password" placeholder="Password">
          <button onclick="closeModal()">Signup</button>
        `;
    }

    modal.style.display = 'flex';
}

function closeModal() {
    document.getElementById('modal').style.display = 'none';
}

document.getElementById('modal').addEventListener('click', (e) => {
    if (e.target.id === 'modal') closeModal();
});