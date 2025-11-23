const galleryContainer = document.getElementById("galleryContainer");
const galleryMessage = document.getElementById("galleryMessage");

// Get login state from localStorage
const userEmail = localStorage.getItem("userEmail");
const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";

// If not logged in, show message and stop
if (!isLoggedIn || !userEmail) {
  galleryMessage.innerHTML = `
    <p>You must be logged in to view your gallery.</p>
    <p><a href="login.html">Go to Login</a></p>
  `;
} else {
  loadGallery();
}

async function loadGallery() {
  galleryMessage.textContent = "Loading your gallery...";

  try {
    const res = await fetch("/gallery-images", {
      headers: {
        "x-user-email": userEmail, // 👈 send email so backend can filter
      },
    });

    const data = await res.json();
    console.log("Gallery response:", data);

    if (!data.success) {
      galleryMessage.textContent =
        data.message || "Unable to load gallery.";
      return;
    }

    if (!data.images || data.images.length === 0) {
      galleryMessage.textContent =
        "No restored images yet. Restore an image on the Home page first.";
      return;
    }

    galleryMessage.textContent = "";
    galleryContainer.innerHTML = "";

    data.images.forEach((img) => {
      const card = document.createElement("div");
      card.className = "gallery-card";

      card.innerHTML = `
        <div class="gallery-images">
          <div>
            <div class="image-label">Original</div>
            <img src="${img.originalUrl}" alt="Original Image" />
          </div>
          <div>
            <div class="image-label">Restored</div>
            <img src="${img.cleanedUrl}" alt="Restored Image" />
          </div>
        </div>
        <div class="gallery-meta">
          <span>Restored image</span>
          <button class="download-btn" data-url="${img.cleanedUrl}">Download</button>
        </div>
      `;

      galleryContainer.appendChild(card);
    });

    // Download button handlers
    document
      .querySelectorAll(".gallery-card .download-btn")
      .forEach((btn) => {
        btn.addEventListener("click", (e) => {
          const url = e.target.getAttribute("data-url");
          const link = document.createElement("a");
          link.href = url;
          link.download = "restored-image.png";
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        });
      });
  } catch (err) {
    console.error("Error loading gallery:", err);
    galleryMessage.textContent = "Error loading gallery.";
  }
}
