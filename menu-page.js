(function () {
  document.documentElement.classList.add("page-menu-html");
  var data = window.MIR_ZINGER_MENU;
  if (!data) return;

  var ORDER_URL =
    "https://www.ubereats.com/ca/store/mir-zinger-chicken-inc/rxzvofAXQeaS_mno1QXcrA";

  function esc(s) {
    if (!s) return "";
    var d = document.createElement("div");
    d.textContent = s;
    return d.innerHTML;
  }

  function navLabelForId(id) {
    var found = data.nav.filter(function (n) {
      return n.id === id;
    })[0];
    return found ? found.label : id;
  }

  function tagLabel(tag) {
    if (tag === "bestseller") return "Best seller";
    if (tag === "combo") return "Combo";
    if (tag === "halal") return "Certified Halal";
    if (tag === "popular") return "Popular";
    if (tag === "spicy") return "Spicy";
    return tag.charAt(0).toUpperCase() + tag.slice(1);
  }

  function renderTags(tags) {
    if (!tags || !tags.length) return "";
    var visibleTags = tags.filter(function (t) {
      return t !== "halal";
    });
    if (!visibleTags.length) return "";
    return (
      '<div class="mz-item__pills">' +
      visibleTags
        .map(function (t) {
          return '<span class="mz-pill mz-pill--' + esc(t) + '">' + esc(tagLabel(t)) + "</span>";
        })
        .join("") +
      "</div>"
    );
  }

  function itemIsFeatured(item) {
    if (!item.tags) return false;
    return item.tags.indexOf("bestseller") >= 0 || item.tags.indexOf("popular") >= 0;
  }

  function housePickImageClass(pick) {
    if (!pick) return "mz-hitCard__img";
    if (pick.name === "Popcorn Chicken") return "mz-hitCard__img mz-hitCard__img--popcorn";
    if (pick.name === "Original Poutine") return "mz-hitCard__img mz-hitCard__img--poutine";
    return "mz-hitCard__img";
  }

  function renderItem(item) {
    var featured = itemIsFeatured(item);
    var priceHtml =
      item.price === "—"
        ? '<span class="mz-item__price mz-item__price--muted">Ask</span>'
        : '<span class="mz-item__price">' + esc(item.price) + "</span>";
    var desc = item.description
      ? '<p class="mz-item__desc">' + esc(item.description) + "</p>"
      : "";
    var cls = "mz-item" + (featured ? " mz-item--featured" : "");
    return (
      "<li class=\"" +
      cls +
      '">' +
      '<div class="mz-item__row">' +
      '<div class="mz-item__main">' +
      '<span class="mz-item__name">' +
      esc(item.name) +
      "</span>" +
      renderTags(item.tags) +
      "</div>" +
      priceHtml +
      "</div>" +
      desc +
      "</li>"
    );
  }

  function renderSection(section) {
    var tier = section.tier || "standard";
    var subtitle = section.subtitle
      ? '<p class="mz-cat__sub">' + esc(section.subtitle) + "</p>"
      : "";
    var items = section.items.map(renderItem).join("");
    return (
      '<section class="mz-cat mz-cat--' +
      esc(tier) +
      '" id="' +
      esc(section.id) +
      '" aria-labelledby="mz-h-' +
      esc(section.id) +
      '">' +
      '<header class="mz-cat__head">' +
      '<div class="mz-cat__headRow">' +
      '<h2 class="mz-cat__title" id="mz-h-' +
      esc(section.id) +
      '">' +
      esc(section.title) +
      "</h2>" +
      "</div>" +
      subtitle +
      "</header>" +
      '<ul class="mz-items">' +
      items +
      "</ul>" +
      "</section>"
    );
  }

  function renderRibbon() {
    return (
      '<aside class="mz-ribbon" aria-label="Order">' +
      '<p class="mz-ribbon__text">Craving it now? Order pickup — hot from our Guelph kitchen.</p>' +
      '<a class="mz-ribbon__btn" href="' +
      ORDER_URL +
      '" target="_blank" rel="noreferrer">Order on Uber Eats</a>' +
      "</aside>"
    );
  }

  function renderHousePicks() {
    var mount = document.getElementById("menuHousePicks");
    if (!mount || !data.housePicks) return;
    mount.innerHTML =
      '<div class="mz-hitGrid" role="list">' +
      data.housePicks
        .map(function (p) {
          return (
            '<a role="listitem" class="mz-hitCard" href="#' +
            esc(p.sectionId) +
            '">' +
            (p.image
              ? '<span class="mz-hitCard__media"><img src="' +
                esc(p.image) +
                '" class="' +
                housePickImageClass(p) +
                '" alt="' +
                esc(p.alt || p.name) +
                '" loading="lazy" /></span>'
              : "") +
            (p.badge ? '<span class="mz-hitCard__badge">' + esc(p.badge) + "</span>" : "") +
            '<span class="mz-hitCard__name">' +
            esc(p.name) +
            "</span>" +
            '<span class="mz-hitCard__price">' +
            esc(p.price) +
            "</span>" +
            (p.note ? '<span class="mz-hitCard__note">' + esc(p.note) + "</span>" : "") +
            '<span class="mz-hitCard__go" aria-hidden="true">View on menu</span>' +
            "</a>"
          );
        })
        .join("") +
      "</div>";
  }

  function renderNav() {
    var mount = document.getElementById("menuCategoryNav");
    if (!mount) return;
    mount.innerHTML =
      '<div class="mz-nav__scroll">' +
      data.nav
        .map(function (n) {
          return '<a class="mz-nav__chip" href="#' + esc(n.id) + '">' + esc(n.label) + "</a>";
        })
        .join("") +
      "</div>";
  }

  function renderSpread() {
    var mount = document.getElementById("menuSpread");
    if (!mount || !data.sections) return;
    var parts = [];
    data.sections.forEach(function (sec) {
      parts.push(renderSection(sec));
      if (sec.id === "zinger-express") parts.push(renderRibbon());
    });
    mount.innerHTML = '<div class="mz-stream">' + parts.join("") + "</div>";
  }

  renderHousePicks();
  renderNav();
  renderSpread();
})();
