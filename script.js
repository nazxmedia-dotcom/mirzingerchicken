const ORDERING_URL = ""; // TODO: paste your online ordering URL here

function setYear() {
  const el = document.querySelector("[data-year]");
  if (el) el.textContent = String(new Date().getFullYear());
}

function setupMobileNav() {
  const toggle = document.querySelector(".nav__toggle");
  const menu = document.querySelector(".nav__menu");
  if (!toggle || !menu) return;

  const setOpen = (open) => {
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
    menu.dataset.open = open ? "true" : "false";
  };

  toggle.addEventListener("click", () => {
    const isOpen = menu.dataset.open === "true";
    setOpen(!isOpen);
  });

  document.addEventListener("click", (e) => {
    const target = e.target;
    if (!(target instanceof Element)) return;
    if (target.closest(".nav")) return;
    setOpen(false);
  });

  menu.addEventListener("click", (e) => {
    const target = e.target;
    if (!(target instanceof Element)) return;
    if (target.matches("a")) setOpen(false);
  });
}

function setupPromoBanner() {
  const banner = document.querySelector("[data-promo]");
  if (!banner) return;

  const KEY = "mzc_promo_closed";
  if (localStorage.getItem(KEY) === "1") return;

  banner.hidden = false;
  const close = banner.querySelector(".promo-banner__close");
  close?.addEventListener("click", () => {
    localStorage.setItem(KEY, "1");
    banner.hidden = true;
  });
}

function setupOrderingLinks() {
  const links = document.querySelectorAll("[data-order-link]");
  links.forEach((a) => {
    if (!(a instanceof HTMLAnchorElement)) return;
    if (!ORDERING_URL) {
      a.setAttribute("aria-disabled", "true");
      a.addEventListener("click", (e) => e.preventDefault());
      return;
    }
    a.href = ORDERING_URL;
    a.target = "_blank";
    a.rel = "noreferrer";
    a.removeAttribute("aria-disabled");
  });
}

function setupActiveNav() {
  const links = Array.from(document.querySelectorAll(".nav__menu a.nav__link")).filter((a) => a instanceof HTMLAnchorElement);
  const sections = links
    .map((a) => document.querySelector(a.getAttribute("href")))
    .filter((el) => el instanceof HTMLElement);

  if (!("IntersectionObserver" in window) || sections.length === 0) return;

  const map = new Map();
  links.forEach((a) => map.set(a.getAttribute("href"), a));

  const io = new IntersectionObserver(
    (entries) => {
      const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => (b.intersectionRatio || 0) - (a.intersectionRatio || 0));
      const top = visible[0];
      if (!top) return;
      const id = `#${top.target.id}`;
      links.forEach((a) => a.classList.remove("is-active"));
      map.get(id)?.classList.add("is-active");
    },
    { rootMargin: "-40% 0px -55% 0px", threshold: [0.1, 0.2, 0.3, 0.4] }
  );

  sections.forEach((s) => io.observe(s));
}

function setupNewsletter() {
  const form = document.querySelector("[data-newsletter]");
  if (!(form instanceof HTMLFormElement)) return;
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const email = form.querySelector("input[type='email']");
    if (email && email instanceof HTMLInputElement && email.validity.valid) {
      form.reset();
      alert("Thanks! You’re signed up for Mir Zinger Chicken updates.");
    }
  });
}

setYear();
setupMobileNav();
setupPromoBanner();
setupOrderingLinks();
setupActiveNav();
setupNewsletter();

