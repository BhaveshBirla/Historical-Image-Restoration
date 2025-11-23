// Handles user session, navbar updates, logout, and user name hover

document.addEventListener('DOMContentLoaded', function() {
  const navbarNav = document.querySelector('.navbar__nav');
  if (!navbarNav) return;

  // Remove any previous user session elements
  function cleanup() {
    const prevUserSession = document.getElementById('user-session-container');
    if (prevUserSession) prevUserSession.remove();
  }

  // Helper: get user name from localStorage
  function getUserName() {
    return localStorage.getItem('userName') || '';
  }

  // Helper: check login status
  function isLoggedIn() {
    return localStorage.getItem('isLoggedIn') === 'true';
  }

  // Helper: create logout link with hover name
  function createLogoutLinkWithHover(name) {
    const logoutA = document.createElement('a');
    logoutA.href = 'login.html';
    logoutA.className = 'logout-btn user-hover-btn';
    logoutA.textContent = 'Logout';
    logoutA.id = 'user-session-container';
    // Tooltip span
    if (name && name.trim().length > 0) {
      const tooltip = document.createElement('span');
      tooltip.className = 'user-hover-tooltip';
      tooltip.textContent = name;
      logoutA.appendChild(tooltip);
    }
    logoutA.addEventListener('click', function(e) {
      e.preventDefault();
      localStorage.removeItem('isLoggedIn');
      localStorage.removeItem('userName');
      window.location.href = 'login.html';
    });
    return logoutA;
  }

  function updateNavbar() {
    cleanup();
    const modeToggle = document.getElementById('modeToggle');
    // Remove login link if present
    const loginLink = Array.from(navbarNav.querySelectorAll('a')).find(a => a.getAttribute('href') === 'login.html');
    if (loginLink) loginLink.remove();
    let userSessionElem;
    if (isLoggedIn()) {
      const name = getUserName();
      userSessionElem = createLogoutLinkWithHover(name);
    } else {
      const loginA = document.createElement('a');
      loginA.href = 'login.html';
      loginA.textContent = 'Login';
      loginA.id = 'user-session-container';
      userSessionElem = loginA;
    }
    // Insert at end (before dark mode if present, else append)
    if (modeToggle && userSessionElem) {
      navbarNav.insertBefore(userSessionElem, modeToggle);
    } else if (userSessionElem) {
      navbarNav.appendChild(userSessionElem);
    }
  }

  updateNavbar();
});

//the below is new
// Show/hide "My Gallery" link based on login status
(function () {
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
  const galleryLink = document.getElementById("myGalleryLink");

  if (galleryLink) {
    galleryLink.style.display = isLoggedIn ? "inline-block" : "none";
  }
})();
//the above is new

// Save userName to localStorage after login and registration
function saveUserNameToLocal(name) {
  if (name) localStorage.setItem('userName', name);
}
window.saveUserNameToLocal = saveUserNameToLocal;
