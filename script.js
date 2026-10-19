const PROJECT_DETAILS = {
  weather: {
    title: "Offline-First Dynamic Weather Forecast Application",
    body: `
      <p><strong>Key Engineering Highlights:</strong></p>
      <ul class="bullet-list" style="margin-top:0.5rem">
        <li><strong>Debounced Search Input:</strong> Prevents API flooding by delaying network dispatch until 300ms after user keystrokes settle.</li>
        <li><strong>Dual-Layer Offline Storage:</strong> Stores recent JSON forecast payloads in IndexedDB and caches static assets in the Service Worker Cache Storage API, reducing redundant API calls by 45%.</li>
        <li><strong>Core Web Vitals:</strong> Reserved fixed dimensions for weather cards to keep Cumulative Layout Shift (CLS) under 0.05 and achieved 95+ Lighthouse Performance.</li>
      </ul>
    `
  },
  "design-system": {
    title: "Accessible Component Design System & Portfolio Platform",
    body: `
      <p><strong>Key Engineering Highlights:</strong></p>
      <ul class="bullet-list" style="margin-top:0.5rem">
        <li><strong>WCAG 2.1 AA Compliance:</strong> Built with semantic landmarks, ARIA live regions, high-contrast theme tokens, and keyboard focus trapping (100 Lighthouse Accessibility score).</li>
        <li><strong>LCP Optimization:</strong> Route-based code splitting and React.lazy reduced initial bundle payload and improved Largest Contentful Paint (LCP) by 35%.</li>
        <li><strong>Automated Testing:</strong> Component behavior, keyboard Escape/Tab handling, and form validation tested with Jest and React Testing Library.</li>
      </ul>
    `
  },
  "task-sync": {
    title: "Client-Side Task & State Synchronization Web Application",
    body: `
      <p><strong>Key Engineering Highlights:</strong></p>
      <ul class="bullet-list" style="margin-top:0.5rem">
        <li><strong>Optimistic UI & Outbox Pattern:</strong> Immediately updates normalized client state (byId/allIds) and persists pending mutations to an IndexedDB sync queue before syncing with Node.js/MongoDB.</li>
        <li><strong>60 FPS Virtualized List Rendering:</strong> Custom windowing calculates visible row indices on scroll so only ~15 DOM nodes are mounted at any time across 10,000+ tasks.</li>
      </ul>
    `
  }
};

// Theme Switcher with LocalStorage Persistence
const themeToggleBtn = document.getElementById("theme-toggle");
const rootEl = document.documentElement;

const savedTheme = localStorage.getItem("kk_portfolio_theme") || "dark";
setTheme(savedTheme);

function setTheme(theme) {
  rootEl.setAttribute("data-theme", theme);
  localStorage.setItem("kk_portfolio_theme", theme);
  const isLight = theme === "light";
  themeToggleBtn.textContent = isLight ? "🌙 Dark" : "☀️ Light";
  themeToggleBtn.setAttribute("aria-pressed", String(isLight));
}

themeToggleBtn.addEventListener("click", () => {
  const current = rootEl.getAttribute("data-theme");
  setTheme(current === "dark" ? "light" : "dark");
});

// Accessible Mobile Menu
const mobileMenuBtn = document.getElementById("mobile-menu-btn");
const navLinks = document.getElementById("nav-links");

mobileMenuBtn.addEventListener("click", () => {
  const expanded = mobileMenuBtn.getAttribute("aria-expanded") === "true";
  mobileMenuBtn.setAttribute("aria-expanded", String(!expanded));
  navLinks.classList.toggle("open");
});

// WCAG 2.1 Accessible Modal with Keyboard Focus Trap
const modal = document.getElementById("project-modal");
const modalTitle = document.getElementById("modal-title");
const modalDesc = document.getElementById("modal-desc");
const modalCloseBtn = document.getElementById("modal-close");
let lastFocusedElement = null;

document.querySelectorAll(".project-modal-trigger").forEach((btn) => {
  btn.addEventListener("click", (e) => {
    const key = e.currentTarget.getAttribute("data-project");
    const details = PROJECT_DETAILS[key];
    if (!details) return;

    lastFocusedElement = e.currentTarget;
    modalTitle.textContent = details.title;
    modalDesc.innerHTML = details.body;
    modal.hidden = false;
    modalCloseBtn.focus();
  });
});

function closeModal() {
  modal.hidden = true;
  if (lastFocusedElement) {
    lastFocusedElement.focus();
  }
}

modalCloseBtn.addEventListener("click", closeModal);
modal.addEventListener("click", (e) => {
  if (e.target === modal) closeModal();
});

document.addEventListener("keydown", (e) => {
  if (modal.hidden) return;
  if (e.key === "Escape") {
    closeModal();
  } else if (e.key === "Tab") {
    // Focus trap inside modal
    const focusable = modal.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  }
});

// Accessible Client-Side Contact Form Validation
const contactForm = document.getElementById("contact-form");
contactForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const nameInput = document.getElementById("sender-name");
  const emailInput = document.getElementById("sender-email");
  const messageInput = document.getElementById("sender-message");

  const nameError = document.getElementById("name-error");
  const emailError = document.getElementById("email-error");
  const messageError = document.getElementById("message-error");
  const statusText = document.getElementById("form-status");

  nameError.textContent = "";
  emailError.textContent = "";
  messageError.textContent = "";
  statusText.textContent = "";

  let valid = true;

  if (!nameInput.value.trim()) {
    nameError.textContent = "Please enter your full name.";
    nameInput.setAttribute("aria-invalid", "true");
    valid = false;
  } else {
    nameInput.setAttribute("aria-invalid", "false");
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailInput.value.trim())) {
    emailError.textContent = "Please enter a valid email address.";
    emailInput.setAttribute("aria-invalid", "true");
    valid = false;
  } else {
    emailInput.setAttribute("aria-invalid", "false");
  }

  if (messageInput.value.trim().length < 10) {
    messageError.textContent = "Message must be at least 10 characters.";
    messageInput.setAttribute("aria-invalid", "true");
    valid = false;
  } else {
    messageInput.setAttribute("aria-invalid", "false");
  }

  if (valid) {
    statusText.textContent = "Thank you! Your message has been validated and prepared.";
    contactForm.reset();
  }
});