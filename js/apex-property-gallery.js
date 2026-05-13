(function () {
  "use strict";

  var CATEGORIES = [
    { key: "exterior", label: "Exterior" },
    { key: "bedroom", label: "Bedroom" },
    { key: "bathroom", label: "Bathroom" },
    { key: "living-room", label: "Living Room" },
    { key: "kitchen", label: "Kitchen" },
    { key: "outdoor", label: "Outdoor Space" }
  ];

  var HEIC_FALLBACK = "assets/images/cabins/the-apex-cover.png";

  function readManifest() {
    var el = document.getElementById("apex-gallery-manifest");
    if (!el || !el.textContent.trim()) return null;
    try {
      return JSON.parse(el.textContent);
    } catch (e) {
      return null;
    }
  }

  function escapeAttr(s) {
    return String(s)
      .replace(/&/g, "&amp;")
      .replace(/"/g, "&quot;")
      .replace(/</g, "&lt;");
  }

  function isHeic(src) {
    return String(src).toLowerCase().endsWith(".heic");
  }

  function buildTileHtml(src, alt, index, total, extraClass) {
    var cls = "apex-gallery-tile" + (extraClass ? " " + extraClass : "");
    var label = alt + " — photo " + (index + 1) + " of " + total + ". Opens larger view.";
    if (isHeic(src)) {
      return (
        '<button type="button" class="' +
        cls +
        '" data-gallery-index="' +
        index +
        '" aria-label="' +
        escapeAttr(label) +
        '">' +
        "<picture>" +
        '<source type="image/heic" srcset="' +
        escapeAttr(src) +
        '">' +
        '<img src="' +
        escapeAttr(HEIC_FALLBACK) +
        '" alt="" width="1200" height="800" loading="' +
        (index === 0 ? "eager" : "lazy") +
        '" decoding="async">' +
        "</picture>" +
        "</button>"
      );
    }
    return (
      '<button type="button" class="' +
      cls +
      '" data-gallery-index="' +
      index +
      '" aria-label="' +
      escapeAttr(label) +
      '">' +
      '<img src="' +
      escapeAttr(src) +
      '" alt="" width="1200" height="800" loading="' +
      (index === 0 ? "eager" : "lazy") +
      '" decoding="async">' +
      "</button>"
    );
  }

  function init() {
    var manifest = readManifest();
    if (!manifest) return;

    var root = document.querySelector("[data-apex-property-gallery]");
    if (!root) return;

    var mosaicEl = document.getElementById("apex-gallery-mosaic");
    var emptyEl = document.getElementById("apex-gallery-empty");
    var tablist = root.querySelector(".apex-gallery-tabs");
    var lightbox = document.getElementById("apex-lightbox");
    if (!mosaicEl || !tablist || !lightbox) return;

    var lbBackdrop = lightbox.querySelector(".apex-lightbox-backdrop");
    var lbClose = lightbox.querySelector(".apex-lightbox-close");
    var lbPrev = lightbox.querySelector(".apex-lightbox-prev");
    var lbNext = lightbox.querySelector(".apex-lightbox-next");
    var lbImg = lightbox.querySelector(".apex-lightbox-img");
    var lbLive = lightbox.querySelector(".apex-lightbox-live");

    var activeKey = CATEGORIES[0].key;
    var activeLabel = CATEGORIES[0].label;
    var activeUrls = [];
    var lightboxIndex = 0;
    var lastFocus = null;

    function urlsForKey(key) {
      var u = manifest[key];
      return u && u.length ? u : [];
    }

    function setActiveTab(key) {
      var tabs = tablist.querySelectorAll('[role="tab"]');
      for (var i = 0; i < tabs.length; i++) {
        var on = tabs[i].getAttribute("data-gallery-key") === key;
        tabs[i].setAttribute("aria-selected", on ? "true" : "false");
        tabs[i].tabIndex = on ? 0 : -1;
        tabs[i].classList.toggle("is-active", on);
      }
    }

    var panel = document.getElementById("apex-gallery-panel");

    function renderMosaic(key) {
      var label = "";
      for (var c = 0; c < CATEGORIES.length; c++) {
        if (CATEGORIES[c].key === key) {
          label = CATEGORIES[c].label;
          break;
        }
      }
      activeKey = key;
      activeLabel = label;
      activeUrls = urlsForKey(key);
      setActiveTab(key);

      mosaicEl.innerHTML = "";
      if (!activeUrls.length) {
        mosaicEl.hidden = true;
        emptyEl.hidden = false;
        if (panel) panel.setAttribute("aria-labelledby", "apex-gallery-tab-" + key);
        return;
      }
      emptyEl.hidden = true;
      mosaicEl.hidden = false;

      var altBase = "The Apex — " + label;
      var hero = buildTileHtml(activeUrls[0], altBase, 0, activeUrls.length, "apex-gallery-tile--hero");
      var sub = "";
      for (var j = 1; j < Math.min(5, activeUrls.length); j++) {
        sub += buildTileHtml(activeUrls[j], altBase, j, activeUrls.length, "");
      }
      var more = "";
      if (activeUrls.length > 5) {
        more += '<div class="apex-gallery-more">';
        for (var k = 5; k < activeUrls.length; k++) {
          more += buildTileHtml(activeUrls[k], altBase, k, activeUrls.length, "apex-gallery-tile--compact");
        }
        more += "</div>";
      }

      if (panel) panel.setAttribute("aria-labelledby", "apex-gallery-tab-" + key);

      var innerClass = "apex-gallery-mosaic-inner";
      if (activeUrls.length === 1) innerClass += " apex-gallery-mosaic-inner--solo";

      mosaicEl.innerHTML =
        '<div class="' +
        innerClass +
        '">' +
        hero +
        '<div class="apex-gallery-subgrid">' +
        sub +
        "</div></div>" +
        more;
    }

    function openLightbox(index) {
      if (!activeUrls.length) return;
      lastFocus = document.activeElement;
      lightboxIndex = (index + activeUrls.length) % activeUrls.length;
      lightbox.hidden = false;
      document.body.classList.add("apex-lightbox-open");
      if (lbPrev) lbPrev.hidden = activeUrls.length <= 1;
      if (lbNext) lbNext.hidden = activeUrls.length <= 1;
      updateLightboxImg();
      if (lbClose) lbClose.focus();
    }

    function closeLightbox() {
      lightbox.hidden = true;
      document.body.classList.remove("apex-lightbox-open");
      if (lbPrev) lbPrev.hidden = false;
      if (lbNext) lbNext.hidden = false;
      if (lastFocus && typeof lastFocus.focus === "function") {
        lastFocus.focus();
      }
    }

    function updateLightboxImg() {
      if (!lbImg || !activeUrls.length) return;
      var src = activeUrls[lightboxIndex];
      if (isHeic(src)) {
        lbImg.src = HEIC_FALLBACK;
      } else {
        lbImg.src = src;
      }
      lbImg.alt = "The Apex — " + activeLabel + " — photo " + (lightboxIndex + 1) + " of " + activeUrls.length;
      if (lbLive) {
        lbLive.textContent = "Photo " + (lightboxIndex + 1) + " of " + activeUrls.length;
      }
    }

    function lightboxStep(delta) {
      if (!activeUrls.length) return;
      lightboxIndex = (lightboxIndex + delta + activeUrls.length) % activeUrls.length;
      updateLightboxImg();
    }

    CATEGORIES.forEach(function (cat, idx) {
      var btn = document.createElement("button");
      btn.type = "button";
      btn.setAttribute("role", "tab");
      btn.setAttribute("data-gallery-key", cat.key);
      btn.id = "apex-gallery-tab-" + cat.key;
      btn.setAttribute("aria-controls", "apex-gallery-panel");
      btn.setAttribute("aria-selected", idx === 0 ? "true" : "false");
      btn.tabIndex = idx === 0 ? 0 : -1;
      btn.className = "apex-gallery-tab" + (idx === 0 ? " is-active" : "");
      btn.textContent = cat.label;
      tablist.appendChild(btn);
    });

    tablist.addEventListener("click", function (e) {
      var t = e.target.closest(".apex-gallery-tab");
      if (!t || !tablist.contains(t)) return;
      var key = t.getAttribute("data-gallery-key");
      if (!key || key === activeKey) return;
      renderMosaic(key);
    });

    tablist.addEventListener("keydown", function (e) {
      var tabs = Array.prototype.slice.call(tablist.querySelectorAll('[role="tab"]'));
      var i = tabs.indexOf(document.activeElement);
      if (i < 0) return;
      if (e.key === "ArrowRight" || e.key === "ArrowDown") {
        e.preventDefault();
        var ni = (i + 1) % tabs.length;
        tabs[ni].focus();
        tabs[ni].click();
      } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
        e.preventDefault();
        var pi = (i - 1 + tabs.length) % tabs.length;
        tabs[pi].focus();
        tabs[pi].click();
      } else if (e.key === "Home") {
        e.preventDefault();
        tabs[0].focus();
        tabs[0].click();
      } else if (e.key === "End") {
        e.preventDefault();
        tabs[tabs.length - 1].focus();
        tabs[tabs.length - 1].click();
      }
    });

    mosaicEl.addEventListener("click", function (e) {
      var tile = e.target.closest(".apex-gallery-tile");
      if (!tile || !mosaicEl.contains(tile)) return;
      var idx = parseInt(tile.getAttribute("data-gallery-index"), 10);
      if (isNaN(idx)) return;
      openLightbox(idx);
    });

    if (lbBackdrop) lbBackdrop.addEventListener("click", closeLightbox);
    if (lbClose) lbClose.addEventListener("click", closeLightbox);
    if (lbPrev) lbPrev.addEventListener("click", function () { lightboxStep(-1); });
    if (lbNext) lbNext.addEventListener("click", function () { lightboxStep(1); });

    lightbox.addEventListener("keydown", function (e) {
      if (lightbox.hidden) return;
      if (e.key === "Escape") {
        e.preventDefault();
        closeLightbox();
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        lightboxStep(-1);
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        lightboxStep(1);
      }
    });

    renderMosaic(CATEGORIES[0].key);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
