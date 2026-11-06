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


// Review composer: local preview only; no server-side submission is implied.
(() => {
  const form = document.getElementById('visitorReviewForm');
  if (!form) return;
  const buttons = [...document.querySelectorAll('.review-face-choice')];
  const preview = document.getElementById('visitorReviewPreview');
  const status = document.getElementById('reviewFormStatus');
  let selected = '1';
  buttons.forEach(button => button.addEventListener('click', () => {
    selected = button.dataset.face;
    buttons.forEach(item => {
      const active = item === button;
      item.classList.toggle('is-selected', active);
      item.setAttribute('aria-pressed', String(active));
    });
  }));
  form.addEventListener('submit', event => {
    event.preventDefault();
    const name = form.elements.name.value.trim();
    const message = form.elements.review.value.trim();
    if (!name || !message) return;
    preview.replaceChildren();
    const img = document.createElement('img');
    img.src = `images/review-face-${selected}.png`;
    img.alt = 'Selected pixel reaction';
    const heading = document.createElement('strong');
    heading.textContent = name;
    const body = document.createElement('p');
    body.textContent = message;
    preview.append(img, heading, body);
    status.hidden = false;
    status.textContent = 'Your review is a private preview on this device; it has not been published.';
  });
})();
