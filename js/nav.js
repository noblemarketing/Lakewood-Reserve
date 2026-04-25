const header = document.querySelector(".site-header");
const navToggle = document.querySelector(".nav-toggle");
const mobileMenu = document.querySelector("#mobile-menu");
const mobileLinks = mobileMenu ? mobileMenu.querySelectorAll("a") : [];

if (header) {
  // Keep the header in a persistent hero-overlay style.
  header.classList.remove("scrolled");
}

function closeMobileMenu() {
  if (!navToggle || !mobileMenu) return;
  navToggle.setAttribute("aria-expanded", "false");
  mobileMenu.hidden = true;
  document.body.classList.remove("menu-open");
}

function openMobileMenu() {
  if (!navToggle || !mobileMenu) return;
  navToggle.setAttribute("aria-expanded", "true");
  mobileMenu.hidden = false;
  document.body.classList.add("menu-open");
}

if (navToggle && mobileMenu) {
  if (!mobileMenu.querySelector(".mobile-menu-close")) {
    const closeBtn = document.createElement("button");
    closeBtn.type = "button";
    closeBtn.className = "mobile-menu-close";
    closeBtn.setAttribute("aria-label", "Close menu");
    closeBtn.textContent = "\u00D7";
    mobileMenu.insertBefore(closeBtn, mobileMenu.firstChild);
    closeBtn.addEventListener("click", closeMobileMenu);
  }

  navToggle.addEventListener("click", () => {
    const isOpen = navToggle.getAttribute("aria-expanded") === "true";
    if (isOpen) closeMobileMenu();
    else openMobileMenu();
  });

  mobileLinks.forEach((link) => {
    link.addEventListener("click", closeMobileMenu);
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && navToggle.getAttribute("aria-expanded") === "true") {
      closeMobileMenu();
      navToggle.focus();
    }
  });
}
