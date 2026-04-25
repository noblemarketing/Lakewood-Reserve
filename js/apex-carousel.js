(function () {
  "use strict";

  function readManifest() {
    var id =
      (document.body && document.body.getAttribute("data-gallery-manifest-id")) ||
      "apex-gallery-manifest";
    var el = document.getElementById(id);
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

  function buildSlide(src, altBase, index, total, eagerFirst) {
    var lower = src.toLowerCase();
    var alt = altBase + " — photo " + (index + 1) + " of " + total;
    var loading = index === 0 && eagerFirst ? "eager" : "lazy";
    if (lower.endsWith(".heic")) {
      return (
        '<li class="apex-carousel-slide" role="group" aria-roledescription="slide" aria-label="' +
        escapeAttr(alt) +
        '" aria-hidden="' +
        (index === 0 ? "false" : "true") +
        '">' +
        '<figure class="apex-carousel-figure">' +
        "<picture>" +
        '<source type="image/heic" srcset="' +
        escapeAttr(src) +
        '">' +
        '<img src="assets/images/cabins/the-apex-cover.png" alt="' +
        escapeAttr(alt) +
        '" width="1920" height="1080" loading="' +
        loading +
        '" decoding="async">' +
        "</picture>" +
        "</figure>" +
        "</li>"
      );
    }
    return (
      '<li class="apex-carousel-slide" role="group" aria-roledescription="slide" aria-label="' +
      escapeAttr(alt) +
      '" aria-hidden="' +
      (index === 0 ? "false" : "true") +
      '">' +
      '<figure class="apex-carousel-figure">' +
      '<img src="' +
      escapeAttr(src) +
      '" alt="' +
      escapeAttr(alt) +
      '" width="1920" height="1080" loading="' +
      loading +
      '" decoding="async">' +
      "</figure>" +
      "</li>"
    );
  }

  function initCarousel(root, manifest, roomKey, label) {
    var urls = manifest[roomKey];
    if (!urls || !urls.length) return;

    var track = document.createElement("ul");
    track.className = "apex-carousel-track";
    track.setAttribute("role", "list");

    for (var i = 0; i < urls.length; i++) {
      track.insertAdjacentHTML("beforeend", buildSlide(urls[i], label, i, urls.length, i === 0));
    }

    var viewport = document.createElement("div");
    viewport.className = "apex-carousel-viewport";
    viewport.appendChild(track);

    var prevBtn = document.createElement("button");
    prevBtn.type = "button";
    prevBtn.className = "apex-carousel-btn apex-carousel-btn--prev";
    prevBtn.setAttribute("aria-label", "Previous " + label + " photo");
    prevBtn.innerHTML =
      '<svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" d="M14 6 8 12l6 6"/></svg>';

    var nextBtn = document.createElement("button");
    nextBtn.type = "button";
    nextBtn.className = "apex-carousel-btn apex-carousel-btn--next";
    nextBtn.setAttribute("aria-label", "Next " + label + " photo");
    nextBtn.innerHTML =
      '<svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" d="m10 6 6 6-6 6"/></svg>';

    var dots = document.createElement("div");
    dots.className = "apex-carousel-dots";
    dots.setAttribute("role", "tablist");
    dots.setAttribute("aria-label", label + " photos");

    for (var d = 0; d < urls.length; d++) {
      var dot = document.createElement("button");
      dot.type = "button";
      dot.className = "apex-carousel-dot" + (d === 0 ? " is-active" : "");
      dot.setAttribute("role", "tab");
      dot.setAttribute("aria-selected", d === 0 ? "true" : "false");
      dot.setAttribute("aria-label", "Show photo " + (d + 1) + " of " + urls.length);
      dot.dataset.index = String(d);
      dots.appendChild(dot);
    }

    var live = document.createElement("p");
    live.className = "apex-carousel-live sr-only";
    live.setAttribute("aria-live", "polite");

    root.innerHTML = "";
    root.appendChild(viewport);
    root.appendChild(prevBtn);
    root.appendChild(nextBtn);
    root.appendChild(dots);
    root.appendChild(live);

    root.setAttribute("role", "region");
    root.setAttribute("aria-roledescription", "carousel");
    root.setAttribute("aria-label", label + " photos");
    root.setAttribute("tabindex", "0");

    var index = 0;
    var slides = track.querySelectorAll(".apex-carousel-slide");
    var dotButtons = dots.querySelectorAll(".apex-carousel-dot");

    function setTransform() {
      track.style.transform = "translateX(-" + index * 100 + "%)";
    }

    function updateDots() {
      for (var j = 0; j < dotButtons.length; j++) {
        var on = j === index;
        dotButtons[j].classList.toggle("is-active", on);
        dotButtons[j].setAttribute("aria-selected", on ? "true" : "false");
      }
    }

    function updateSlidesAria() {
      for (var k = 0; k < slides.length; k++) {
        slides[k].setAttribute("aria-hidden", k === index ? "false" : "true");
      }
    }

    function announce() {
      live.textContent = "Photo " + (index + 1) + " of " + urls.length;
    }

    function goTo(i) {
      if (!urls.length) return;
      index = (i + urls.length) % urls.length;
      setTransform();
      updateDots();
      updateSlidesAria();
      announce();
    }

    prevBtn.addEventListener("click", function () {
      goTo(index - 1);
    });
    nextBtn.addEventListener("click", function () {
      goTo(index + 1);
    });

    dots.addEventListener("click", function (e) {
      var t = e.target.closest(".apex-carousel-dot");
      if (!t || !dots.contains(t)) return;
      var idx = parseInt(t.dataset.index, 10);
      if (!isNaN(idx)) goTo(idx);
    });

    root.addEventListener("keydown", function (e) {
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        goTo(index - 1);
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        goTo(index + 1);
      }
    });

    var touchStartX = null;
    viewport.addEventListener(
      "touchstart",
      function (e) {
        if (!e.changedTouches.length) return;
        touchStartX = e.changedTouches[0].clientX;
      },
      { passive: true }
    );
    viewport.addEventListener(
      "touchend",
      function (e) {
        if (touchStartX == null || !e.changedTouches.length) return;
        var dx = e.changedTouches[0].clientX - touchStartX;
        touchStartX = null;
        if (Math.abs(dx) < 40) return;
        if (dx > 0) goTo(index - 1);
        else goTo(index + 1);
      },
      { passive: true }
    );

    if (urls.length <= 1) {
      prevBtn.hidden = true;
      nextBtn.hidden = true;
      dots.hidden = true;
    }

    setTransform();
    announce();
  }

  function run() {
    var manifest = readManifest();
    if (!manifest) return;

    document.querySelectorAll("[data-apex-carousel]").forEach(function (root) {
      var roomKey = root.getAttribute("data-apex-carousel");
      var label = root.getAttribute("data-apex-carousel-label") || roomKey;
      if (!roomKey) return;
      initCarousel(root, manifest, roomKey, label);
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", run);
  } else {
    run();
  }
})();
