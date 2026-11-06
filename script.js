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


// Public portfolio reviews: moderated submissions stored in Supabase.
(() => {
  const form = document.getElementById('visitorReviewForm');
  if (!form) return;
  const buttons = [...document.querySelectorAll('.review-face-choice')];
  const preview = document.getElementById('visitorReviewPreview');
  const status = document.getElementById('reviewFormStatus');
  const community = document.getElementById('communityReviews');
  const config = window.PORTFOLIO_SUPABASE || {};
  const configured = /^https:\/\/[a-z0-9-]+\.supabase\.co$/i.test(config.url || '') &&
    typeof config.publishableKey === 'string' && config.publishableKey.length > 15 &&
    !config.publishableKey.includes('PASTE_');
  let selected = '1';
  let busy = false;
  const message = (value) => { status.hidden = false; status.textContent = value; };
  const headers = () => ({ apikey: config.publishableKey, Authorization: `Bearer ${config.publishableKey}` });
  buttons.forEach(button => button.addEventListener('click', () => {
    selected = button.dataset.face;
    buttons.forEach(item => {
      const active = item === button;
      item.classList.toggle('is-selected', active);
      item.setAttribute('aria-pressed', String(active));
    });
  }));
  function displayReview(target, review) {
    const card = document.createElement('article');
    card.className = 'review-card';
    const img = document.createElement('img');
    img.src = `images/review-face-${[1,2,3].includes(Number(review.face)) ? review.face : 1}.png`;
    img.alt = 'Pixel reaction';
    img.width = 70; img.height = 70; img.loading = 'lazy';
    const name = document.createElement('strong');
    name.textContent = review.name;
    const body = document.createElement('p');
    body.textContent = review.review;
    card.append(img, name, body);
    target.append(card);
  }
  async function loadReviews() {
    if (!configured || !community) return;
    try {
      const response = await fetch(`${config.url}/rest/v1/portfolio_reviews?select=name,review,face&approved=eq.true&order=created_at.desc&limit=30`, { headers: headers() });
      if (!response.ok) throw Error('Unable to load reviews');
      const reviews = await response.json();
      community.replaceChildren();
      reviews.forEach(review => displayReview(community, review));
    } catch (error) { console.warn('Portfolio reviews:', error.message); }
  }
  form.addEventListener('submit', async event => {
    event.preventDefault();
    if (busy) return;
    const name = form.elements.name.value.trim();
    const review = form.elements.review.value.trim();
    if (!name || !review || name.length > 50 || review.length > 600) return;
    if (!configured) { message('Review submissions are not connected yet. Please try again later.'); return; }
    const submit = form.querySelector('[type="submit"]');
    busy = true; submit.disabled = true;
    message('Submitting your review...');
    try {
      const response = await fetch(`${config.url}/rest/v1/portfolio_reviews`, {
        method: 'POST',
        headers: { ...headers(), 'Content-Type': 'application/json', Prefer: 'return=minimal' },
        body: JSON.stringify({ name, review, face: Number(selected) })
      });
      if (!response.ok) throw Error(`Submission failed (${response.status})`);
      preview.replaceChildren();
      displayReview(preview, { name, review, face: selected });
      form.reset();
      message('Thank you! Your review was submitted and will appear after approval.');
    } catch (error) {
      console.error('Portfolio review submission:', error);
      message('Could not submit your review. Please try again later.');
    } finally { busy = false; submit.disabled = false; }
  });
  loadReviews();
})();
