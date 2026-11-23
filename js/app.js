(function () {
  "use strict";

  const menu = window.MOCHERITO_MENU || [];
  const pageElement = document.getElementById("page");
  const bookElement = document.getElementById("book");
  const dotsElement = document.getElementById("pageDots");
  const currentElement = document.getElementById("pageCurrent");
  const totalElement = document.getElementById("pageTotal");
  const prevButton = document.getElementById("prevButton");
  const nextButton = document.getElementById("nextButton");
  let currentPage = 0;
  let zoom = 1;

  totalElement.textContent = menu.length;

  function escapeHtml(value) {
    return String(value)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;");
  }

  function productMarkup(product) {
    const details = [
      product.presentation ? `<span class="product-presentation">${escapeHtml(product.presentation)}</span>` : "",
      product.description ? `<span>${escapeHtml(product.description)}</span>` : ""
    ].join("");
    return `
      <li class="product">
        <div class="product-heading">
          <h3><span class="product-number">${escapeHtml(product.number)}.</span> ${escapeHtml(product.name)}</h3>
          <span class="price">S/ ${escapeHtml(product.price)}</span>
        </div>
        ${details ? `<p class="product-description">${details}</p>` : ""}
      </li>`;
  }

  function extrasMarkup(extras) {
    if (!extras) return "";
    return `<div class="marine-options">${extras.map(extra => `
      <div class="marine-option">
        <div class="option-heading"><h3>${escapeHtml(extra.name)}</h3><span class="price">S/ ${escapeHtml(extra.price)}</span></div>
        <ul>${extra.options.map(option => `<li>${escapeHtml(option)}</li>`).join("")}</ul>
      </div>`).join("")}</div>`;
  }

  function drinksMarkup(groups) {
    return groups.map(group => `
      <section class="drink-group">
        <h3>${escapeHtml(group.name)}</h3>
        ${group.items.map(item => `
          <div class="drink-item">
            <span>${escapeHtml(item.name)}</span>
            ${item.price
              ? `<span class="price">S/ ${escapeHtml(item.price)}</span>`
              : `<span class="drink-sizes"><b>1/2 jarra:</b> S/ ${escapeHtml(item.half)} &nbsp; <b>1 jarra:</b> S/ ${escapeHtml(item.full)}</span>`}
          </div>`).join("")}
      </section>`).join("");
  }

  function coverMarkup(page) {
    return `
      <div class="cover">
        <div class="sun-mark" aria-hidden="true"><span></span></div>
        <p class="welcome">Bienvenidos.</p>
        <p class="welcome-name">Peño Taesek.</p>
        <header class="cover-logo">
          <p class="cover-brand">${escapeHtml(page.title)}</p>
          <p class="cover-subtitle">${escapeHtml(page.subtitle)}</p>
        </header>
        <div class="cover-divider" aria-hidden="true"></div>
        <p class="presentation">“Entre recetas milenarias y creaciones auténticas, nace Mocherito, una taberna criolla que rinde homenaje a la gastronomía peruana desde la riqueza de nuestros Andes, el color de nuestra Amazonía y el sabor de nuestra costa”.</p>
        <p class="domain">MOCHERITO.COM</p>
      </div>`;
  }

  function contentMarkup(page) {
    const categories = page.categories.map((category, categoryIndex) => `
      <section class="menu-category ${categoryIndex === 0 ? "category-first" : "category-second"}">
        <header class="category-header">
          <div>
            <h2>${escapeHtml(category.name)}</h2>
            ${category.label ? `<span class="category-label">${escapeHtml(category.label)}</span>` : ""}
          </div>
          <span class="category-emblem" aria-hidden="true"></span>
        </header>
        ${category.description ? `<p class="category-description">${escapeHtml(category.description)}</p>` : ""}
        ${category.products ? `<ul class="product-list">${category.products.map(productMarkup).join("")}</ul>` : ""}
        ${category.extras ? extrasMarkup(category.extras) : ""}
        ${category.drinkGroups ? drinksMarkup(category.drinkGroups) : ""}
      </section>`).join("");

    return `
      <div class="interior-header">
        <span class="mini-brand">MOCHERITO</span>
        <span class="page-title">${escapeHtml(page.title)}</span>
      </div>
      <div class="menu-columns">${categories}</div>`;
  }

  function render() {
    const page = menu[currentPage];
    pageElement.classList.remove("is-active");
    pageElement.innerHTML = page.kind === "cover" ? coverMarkup(page) : contentMarkup(page);
    void pageElement.offsetWidth;
    pageElement.classList.add("is-active");
    currentElement.textContent = currentPage + 1;

    dotsElement.querySelectorAll("button").forEach((dot, index) => {
      dot.classList.toggle("is-active", index === currentPage);
      dot.setAttribute("aria-current", index === currentPage ? "page" : "false");
    });

    prevButton.disabled = currentPage === 0;
    nextButton.disabled = currentPage === menu.length - 1;
    history.replaceState(null, "", `#${page.id}`);
  }

  function goTo(index) {
    if (index < 0 || index >= menu.length) return;
    const direction = index > currentPage ? "next" : "previous";
    if (pageElement.classList.contains("is-turning")) return;

    pageElement.classList.add("is-turning");
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const nextDirection = direction === "next";
    const duration = reduceMotion ? 1 : 620;

    if (typeof pageElement.animate === "function") {
      const animation = pageElement.animate(
        nextDirection
          ? [
              { transform: "perspective(1800px) rotateY(0deg) translateZ(0)", opacity: 1, filter: "brightness(1)" },
              { transform: "perspective(1800px) rotateY(-48deg) translateZ(12px)", opacity: 0.92, filter: "brightness(.82)", offset: 0.48 },
              { transform: "perspective(1800px) rotateY(-92deg) translateZ(24px)", opacity: 0, filter: "brightness(.65)" }
            ]
          : [
              { transform: "perspective(1800px) rotateY(0deg) translateZ(0)", opacity: 1, filter: "brightness(1)" },
              { transform: "perspective(1800px) rotateY(48deg) translateZ(12px)", opacity: 0.92, filter: "brightness(.82)", offset: 0.48 },
              { transform: "perspective(1800px) rotateY(92deg) translateZ(24px)", opacity: 0, filter: "brightness(.65)" }
            ],
        {
          duration: duration * 0.5,
          easing: "cubic-bezier(.3,.05,.25,1)",
          fill: "forwards"
        }
      );
      pageElement.style.transformOrigin = nextDirection ? "left center" : "right center";
      window.setTimeout(() => {
        animation.cancel();
        currentPage = index;
        render();

        const incoming = pageElement.animate(
          nextDirection
            ? [
                { transform: "perspective(1800px) rotateY(92deg) translateZ(24px)", opacity: 0, filter: "brightness(.65)" },
                { transform: "perspective(1800px) rotateY(48deg) translateZ(12px)", opacity: 0.92, filter: "brightness(.82)", offset: 0.52 },
                { transform: "perspective(1800px) rotateY(0deg) translateZ(0)", opacity: 1, filter: "brightness(1)" }
              ]
            : [
                { transform: "perspective(1800px) rotateY(-92deg) translateZ(24px)", opacity: 0, filter: "brightness(.65)" },
                { transform: "perspective(1800px) rotateY(-48deg) translateZ(12px)", opacity: 0.92, filter: "brightness(.82)", offset: 0.52 },
                { transform: "perspective(1800px) rotateY(0deg) translateZ(0)", opacity: 1, filter: "brightness(1)" }
              ],
          {
            duration: duration * 0.5,
            easing: "cubic-bezier(.25,.05,.3,1)",
            fill: "forwards"
          }
        );

        incoming.finished.then(() => {
          incoming.cancel();
          pageElement.style.transformOrigin = "";
          pageElement.classList.remove("is-turning");
        }).catch(() => {});
      }, duration * 0.5);
    } else {
      window.setTimeout(() => {
        currentPage = index;
        render();
        pageElement.classList.remove("is-turning");
      }, 180);
    }
  }

  menu.forEach((page, index) => {
    const dot = document.createElement("button");
    dot.type = "button";
    dot.setAttribute("aria-label", `Ir a la página ${index + 1}: ${page.title}`);
    dot.addEventListener("click", () => goTo(index));
    dotsElement.appendChild(dot);
  });

  prevButton.addEventListener("click", () => goTo(currentPage - 1));
  nextButton.addEventListener("click", () => goTo(currentPage + 1));
  document.getElementById("homeButton").addEventListener("click", () => goTo(0));

  document.getElementById("zoomInButton").addEventListener("click", () => {
    zoom = Math.min(1.25, zoom + 0.1);
    bookElement.style.setProperty("--book-scale", zoom);
  });
  document.getElementById("zoomOutButton").addEventListener("click", () => {
    zoom = Math.max(0.85, zoom - 0.1);
    bookElement.style.setProperty("--book-scale", zoom);
  });
  document.getElementById("fullscreenButton").addEventListener("click", async () => {
    try {
      if (!document.fullscreenElement) await document.documentElement.requestFullscreen();
      else await document.exitFullscreen();
    } catch (_) {
      // Fullscreen can be unavailable in embedded browsers.
    }
  });

  document.addEventListener("keydown", event => {
    if (event.key === "ArrowRight" || event.key === "PageDown") goTo(currentPage + 1);
    if (event.key === "ArrowLeft" || event.key === "PageUp") goTo(currentPage - 1);
    if (event.key === "Home") goTo(0);
  });

  let touchStartX = null;
  pageElement.addEventListener("touchstart", event => {
    touchStartX = event.changedTouches[0].clientX;
  }, { passive: true });
  pageElement.addEventListener("touchend", event => {
    if (touchStartX === null) return;
    const distance = event.changedTouches[0].clientX - touchStartX;
    if (Math.abs(distance) > 55) goTo(currentPage + (distance < 0 ? 1 : -1));
    touchStartX = null;
  }, { passive: true });

  const hashIndex = menu.findIndex(page => `#${page.id}` === location.hash);
  if (hashIndex >= 0) currentPage = hashIndex;
  render();
})();
