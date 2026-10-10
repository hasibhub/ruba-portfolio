const menuButton = document.getElementById("menuDots");
const dropdownMenu = document.getElementById("dropdownMenu");

if (menuButton && dropdownMenu) {
  menuButton.addEventListener("click", (event) => {
    event.stopPropagation();

    const isOpen = dropdownMenu.classList.toggle("show");
    menuButton.setAttribute("aria-expanded", String(isOpen));
  });

  dropdownMenu.addEventListener("click", (event) => {
    if (event.target.closest("a")) {
      dropdownMenu.classList.remove("show");
      menuButton.setAttribute("aria-expanded", "false");
    }
  });

  document.addEventListener("click", (event) => {
    if (!event.target.closest(".menu-area")) {
      dropdownMenu.classList.remove("show");
      menuButton.setAttribute("aria-expanded", "false");
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      dropdownMenu.classList.remove("show");
      menuButton.setAttribute("aria-expanded", "false");
    }
  });
}

// Highlight the current navigation section
const sections = document.querySelectorAll("main section[id]");
const navLinks = document.querySelectorAll(".dropdown-menu .main-menu-link");

if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        navLinks.forEach((link) => {
          link.classList.toggle(
            "active",
            link.getAttribute("href") === `#${entry.target.id}`
          );
        });
      }
    });
  }, { threshold: 0.25 });

  sections.forEach((section) => observer.observe(section));
}
