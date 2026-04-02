const ORDERING_URL = "https://www.ubereats.com/ca/store/mir-zinger-chicken-inc/rxzvofAXQeaS_mno1QXcrA";
const HALAL_INFO_URL = "halal.html";
const IN_STORE_PROMO_KEY = "mzc_instore_offer_closed_v1";

function setYear() {
  const el = document.querySelector("[data-year]");
  if (el) el.textContent = String(new Date().getFullYear());
}

function setupMobileNav() {
  const header = document.querySelector("[data-header]");
  const toggle = document.querySelector(".nav__toggle");
  const menu = document.querySelector(".nav__menu");
  if (!toggle || !menu) return;

  const setOpen = (open) => {
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
    menu.dataset.open = open ? "true" : "false";
    document.body.classList.toggle("nav-open", open);
    if (header) header.dataset.navOpen = open ? "true" : "false";
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

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") setOpen(false);
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 980) setOpen(false);
  });
}

function setupHeaderState() {
  const header = document.querySelector("[data-header]");
  if (!(header instanceof HTMLElement)) return;

  const sync = () => {
    header.dataset.scrolled = window.scrollY > 10 ? "true" : "false";
  };

  sync();
  window.addEventListener("scroll", sync, { passive: true });
}

function setupInStorePromo() {
  if (document.querySelector(".site-promo")) return;

  let dismissed = false;
  try {
    dismissed = sessionStorage.getItem(IN_STORE_PROMO_KEY) === "1";
  } catch (_) {
    dismissed = false;
  }
  if (dismissed) return;

  const promo = document.createElement("aside");
  promo.className = "site-promo";
  promo.setAttribute("aria-label", "In-store feature");
  promo.setAttribute("data-state", "hidden");
  promo.innerHTML =
    '<div class="site-promo__top">' +
    '<span class="site-promo__badge">In-Store Favourite</span>' +
    '<button class="site-promo__close" type="button" aria-label="Dismiss in-store feature">✕</button>' +
    "</div>" +
    '<div class="site-promo__body">' +
    '<h2 class="site-promo__title">Walk In Hungry. Leave With a Zinger.</h2>' +
    '<p class="site-promo__copy">Visit Mir Zinger Chicken in Guelph for crispy halal chicken, bold flavour, and local favourites made fresh.</p>' +
    "</div>" +
    '<div class="site-promo__actions">' +
    '<a class="site-promo__cta" href="contact.html">Visit In Store</a>' +
    "</div>";

  const close = promo.querySelector(".site-promo__close");
  let armed = false;
  let shown = false;

  const dismissPromo = () => {
    promo.setAttribute("data-state", "dismissed");
    try {
      sessionStorage.setItem(IN_STORE_PROMO_KEY, "1");
    } catch (_) {
      // Ignore storage failures and still dismiss visually.
    }
  };

  const showPromo = () => {
    if (shown || promo.getAttribute("data-state") === "dismissed") return;
    shown = true;
    requestAnimationFrame(() => {
      promo.setAttribute("data-state", "visible");
    });
    window.removeEventListener("scroll", maybeReveal);
  };

  const maybeReveal = () => {
    if (!armed || shown) return;
    if (window.scrollY > 120) showPromo();
  };

  close?.addEventListener("click", dismissPromo);
  document.body.appendChild(promo);

  window.addEventListener("scroll", maybeReveal, { passive: true });

  window.setTimeout(() => {
    armed = true;
    maybeReveal();
  }, 900);

  window.setTimeout(() => {
    if (armed) showPromo();
  }, 2600);
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

function setupHalalButtons() {
  const badges = document.querySelectorAll(".halal-sign:not(a)");
  badges.forEach((badge) => {
    if (!(badge instanceof HTMLElement)) return;
    badge.textContent = "Certified Halal";
    badge.tabIndex = 0;
    badge.setAttribute("role", "link");
    badge.setAttribute("aria-label", "Open Halal Info page");

    const goToHalalPage = (e) => {
      e.preventDefault();
      e.stopPropagation();
      window.location.href = HALAL_INFO_URL;
    };

    badge.addEventListener("click", goToHalalPage);
    badge.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") goToHalalPage(e);
    });
  });
}

setYear();
setupMobileNav();
setupHeaderState();
setupInStorePromo();
setupOrderingLinks();
setupActiveNav();
setupNewsletter();
setupHalalButtons();

