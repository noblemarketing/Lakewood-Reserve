(function () {
  "use strict";

  var STAR_PATH =
    "M12 2.5l2.9 6.1 6.8.6-5.1 4.5 1.5 6.6L12 17.8l-6.1 3.5 1.5-6.6-5.1-4.5 6.8-.6L12 2.5z";

  var AVATAR_COLORS = ["#8b7ab8", "#d4849a", "#6b9e9a", "#c4a56a", "#7a8fc4"];

  var REVIEWS = [
    {
      property: "apex",
      propertyLabel: "The Apex",
      name: "Andrew",
      location: "",
      rating: 5,
      dateLabel: "1 week ago",
      text:
        "Me and my wife loved our stay at the Apex! We would definitely recommend it to anyone. Great communication, true to the description in the listing, excellent living space, and attention to detail. The wood fired hot tub was definitely a highlight!",
    },
    {
      property: "apex",
      propertyLabel: "The Apex",
      name: "Jess",
      location: "",
      rating: 5,
      dateLabel: "Recent stay",
      text:
        "Our stay at The Apex was wonderful from beginning to end. What a gem in the heart of the Raystown region! The design and amenities clearly show intention and thought and we left incredibly rested and refreshed. We loved how nature and beauty surrounded you, both indoors and outdoors. We also enjoyed the short walk to the lake, paddleboarding, and hiking on a nearby trail. We are already looking forward to a return trip.",
    },
    {
      property: "apex",
      propertyLabel: "The Apex",
      name: "Dove",
      location: "",
      rating: 5,
      dateLabel: "Recent stay",
      text:
        "We loved our stay here. It is in a very quiet and peaceful part of PA. The cabin was clean and the hosts were very communicative and had great information about the surrounding area. If you are looking for a quiet retreat we would definitely recommend!",
    },
    {
      property: "anchor-28",
      propertyLabel: "Anchor Twenty Eight",
      name: "Audrey",
      location: "",
      rating: 5,
      dateLabel: "Recent stay",
      text:
        "The amenities at Anchor Twenty Eight are incredible, and we loved how private the whole experience felt. From the thoughtful details inside to the outdoor spaces, everything was set up for a peaceful, restorative stay. We felt completely tucked away and could truly unwind.",
    },
  ];

  var DESKTOP_QUERY = window.matchMedia("(min-width: 768px)");
  var REDUCED_MOTION_QUERY = window.matchMedia("(prefers-reduced-motion: reduce)");
  var AUTO_ROTATE_MS = 6000;

  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function renderStars(count) {
    var stars = "";
    for (var i = 0; i < count; i += 1) {
      stars +=
        '<svg viewBox="0 0 24 24" focusable="false"><path d="' +
        STAR_PATH +
        '"/></svg>';
    }
    return stars;
  }

  function getInitial(name) {
    var trimmed = String(name || "").trim();
    return trimmed ? trimmed.charAt(0).toUpperCase() : "?";
  }

  function renderReviewCard(review, index, showPropertyLabel) {
    var rating = 5;
    var avatarColor = AVATAR_COLORS[index % AVATAR_COLORS.length];
    var propertyHtml =
      showPropertyLabel && review.propertyLabel
        ? '<p class="guest-review-card-property">' +
          escapeHtml(review.propertyLabel) +
          "</p>"
        : "";
    return (
      '<li class="guest-reviews-slide" role="group" aria-roledescription="slide">' +
      '<article class="guest-review-card">' +
      '<div class="guest-review-card-stars" aria-label="Rated ' +
      rating +
      ' out of 5">' +
      renderStars(rating) +
      "</div>" +
      '<blockquote class="guest-review-card-text">' +
      "<p>" +
      escapeHtml(review.text) +
      "</p>" +
      "</blockquote>" +
      '<footer class="guest-review-card-footer">' +
      '<span class="guest-review-avatar" style="background-color:' +
      avatarColor +
      '" aria-hidden="true">' +
      escapeHtml(getInitial(review.name)) +
      "</span>" +
      '<cite class="guest-review-card-name">' +
      escapeHtml(review.name) +
      "</cite>" +
      propertyHtml +
      "</footer>" +
      "</article>" +
      "</li>"
    );
  }

  function getSlidesPerView() {
    return DESKTOP_QUERY.matches ? 2 : 1;
  }

  function initCarousel(root, reviews) {
    var index = 0;
    var isProgrammaticScroll = false;
    var autoRotateTimer = null;
    var resumeTimer = null;
    var viewport = root.querySelector(".guest-reviews-viewport");
    var slides = root.querySelectorAll(".guest-reviews-slide");
    var dotButtons = root.querySelectorAll(".guest-reviews-dot");
    var dotsWrap = root.querySelector(".guest-reviews-dots");
    var prevBtn = root.querySelector(".guest-reviews-btn--prev");
    var nextBtn = root.querySelector(".guest-reviews-btn--next");
    var live = root.querySelector(".guest-reviews-live");

    function maxIndex() {
      return Math.max(0, reviews.length - 1);
    }

    function canScroll() {
      return reviews.length > 1;
    }

    function normalizeIndex(i) {
      var len = reviews.length;
      if (!len) return 0;
      return ((i % len) + len) % len;
    }

    function shouldAutoRotate() {
      return canScroll() && !REDUCED_MOTION_QUERY.matches && !document.hidden;
    }

    function stopAutoRotate() {
      if (autoRotateTimer) {
        window.clearInterval(autoRotateTimer);
        autoRotateTimer = null;
      }
      if (resumeTimer) {
        window.clearTimeout(resumeTimer);
        resumeTimer = null;
      }
    }

    function startAutoRotate() {
      stopAutoRotate();
      if (!shouldAutoRotate()) return;
      autoRotateTimer = window.setInterval(advance, AUTO_ROTATE_MS);
    }

    function pauseAutoRotate(resumeAfterMs) {
      stopAutoRotate();
      if (!shouldAutoRotate()) return;
      if (typeof resumeAfterMs === "number") {
        resumeTimer = window.setTimeout(startAutoRotate, resumeAfterMs);
      }
    }

    function resetAutoRotate() {
      pauseAutoRotate(AUTO_ROTATE_MS);
    }

    function getSlideOffset(i) {
      var slide = slides[i];
      return slide ? slide.offsetLeft : 0;
    }

    function updateActive() {
      var perView = getSlidesPerView();
      for (var i = 0; i < slides.length; i += 1) {
        var visible =
          canScroll() && i >= index && i < Math.min(index + perView, slides.length);
        if (!canScroll()) visible = true;
        slides[i].classList.toggle("is-active", i === index);
        slides[i].setAttribute("aria-hidden", visible ? "false" : "true");
      }
    }

    function updateScrollPosition(smooth) {
      if (!canScroll()) {
        isProgrammaticScroll = true;
        viewport.scrollLeft = 0;
        window.setTimeout(function () {
          isProgrammaticScroll = false;
        }, 0);
        return;
      }

      var offset = getSlideOffset(index);
      isProgrammaticScroll = true;
      viewport.scrollTo({
        left: offset,
        behavior: smooth === false ? "auto" : "smooth",
      });
      window.setTimeout(function () {
        isProgrammaticScroll = false;
      }, smooth === false ? 0 : 450);
    }

    function syncIndexFromScroll() {
      if (isProgrammaticScroll || !canScroll()) return;

      var left = viewport.scrollLeft;
      var closest = 0;
      var minDist = Infinity;

      for (var i = 0; i < reviews.length; i += 1) {
        var dist = Math.abs(getSlideOffset(i) - left);
        if (dist < minDist) {
          minDist = dist;
          closest = i;
        }
      }

      if (closest !== index) {
        index = closest;
        updateActive();
        updateDots();
        announce();
      }
    }

    function scrollIndexForReview(reviewIndex) {
      return Math.max(0, Math.min(reviewIndex, maxIndex()));
    }

    function updateDots() {
      for (var d = 0; d < dotButtons.length; d += 1) {
        var on = d === index;
        dotButtons[d].classList.toggle("is-active", on);
        dotButtons[d].setAttribute("aria-selected", on ? "true" : "false");
      }
    }

    function updateNav() {
      var scrollable = canScroll();
      prevBtn.disabled = false;
      nextBtn.disabled = false;
      prevBtn.hidden = !scrollable;
      nextBtn.hidden = !scrollable;
      if (dotsWrap) dotsWrap.hidden = reviews.length <= 1;
      root.classList.toggle("guest-reviews-carousel--static", !scrollable);
    }

    function announce() {
      if (!live) return;
      live.textContent =
        "Review " + (index + 1) + " of " + reviews.length + " by " + reviews[index].name;
    }

    function refresh(smooth) {
      index = Math.max(0, Math.min(maxIndex(), index));
      updateScrollPosition(smooth);
      updateActive();
      updateDots();
      updateNav();
      announce();
    }

    function goTo(i, smooth) {
      if (!reviews.length) return;
      index = canScroll() ? normalizeIndex(i) : 0;
      refresh(smooth);
    }

    function advance() {
      if (!canScroll()) return;
      goTo(index + 1);
    }

    function retreat() {
      if (!canScroll()) return;
      goTo(index - 1);
    }

    prevBtn.addEventListener("click", function () {
      retreat();
      resetAutoRotate();
    });
    nextBtn.addEventListener("click", function () {
      advance();
      resetAutoRotate();
    });

    root.querySelector(".guest-reviews-dots").addEventListener("click", function (e) {
      var dot = e.target.closest(".guest-reviews-dot");
      if (!dot || !root.contains(dot)) return;
      var idx = parseInt(dot.getAttribute("data-index"), 10);
      if (!isNaN(idx)) {
        goTo(scrollIndexForReview(idx));
        resetAutoRotate();
      }
    });

    root.addEventListener("keydown", function (e) {
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        retreat();
        resetAutoRotate();
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        advance();
        resetAutoRotate();
      }
    });

    var scrollTimer;
    viewport.addEventListener(
      "scroll",
      function () {
        if (isProgrammaticScroll) return;
        window.clearTimeout(scrollTimer);
        scrollTimer = window.setTimeout(function () {
          syncIndexFromScroll();
          resetAutoRotate();
        }, 80);
      },
      { passive: true }
    );

    viewport.addEventListener(
      "wheel",
      function (e) {
        if (!canScroll()) return;
        var delta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
        if (Math.abs(delta) < 12) return;
        e.preventDefault();
        if (delta > 0) advance();
        else retreat();
        resetAutoRotate();
      },
      { passive: false }
    );

    root.addEventListener("mouseenter", function () {
      pauseAutoRotate();
    });
    root.addEventListener("mouseleave", function () {
      startAutoRotate();
    });
    root.addEventListener("focusin", function () {
      pauseAutoRotate();
    });
    root.addEventListener("focusout", function (e) {
      if (!root.contains(e.relatedTarget)) startAutoRotate();
    });
    viewport.addEventListener(
      "touchstart",
      function () {
        pauseAutoRotate(AUTO_ROTATE_MS * 2);
      },
      { passive: true }
    );

    document.addEventListener("visibilitychange", function () {
      if (document.hidden) stopAutoRotate();
      else startAutoRotate();
    });

    function bindMotionPreference(query) {
      var onChange = function () {
        if (query.matches) stopAutoRotate();
        else startAutoRotate();
      };
      if (typeof query.addEventListener === "function") {
        query.addEventListener("change", onChange);
      } else if (typeof query.addListener === "function") {
        query.addListener(onChange);
      }
    }

    bindMotionPreference(REDUCED_MOTION_QUERY);

    if (typeof DESKTOP_QUERY.addEventListener === "function") {
      DESKTOP_QUERY.addEventListener("change", function () {
        refresh(false);
      });
    } else if (typeof DESKTOP_QUERY.addListener === "function") {
      DESKTOP_QUERY.addListener(function () {
        refresh(false);
      });
    }

    window.addEventListener("resize", function () {
      refresh(false);
      startAutoRotate();
    });
    refresh(false);
    startAutoRotate();
  }

  function buildCarousel(reviews, showPropertyLabel) {
    var slidesHtml = reviews
      .map(function (review, index) {
        return renderReviewCard(review, index, showPropertyLabel);
      })
      .join("");

    var dotsHtml = reviews
      .map(function (review, index) {
        return (
          '<button type="button" class="guest-reviews-dot' +
          (index === 0 ? " is-active" : "") +
          '" role="tab" data-index="' +
          index +
          '" aria-selected="' +
          (index === 0 ? "true" : "false") +
          '" aria-label="Show review by ' +
          escapeHtml(review.name) +
          '"></button>'
        );
      })
      .join("");

    return (
      '<div class="guest-reviews-carousel" role="region" aria-roledescription="carousel" aria-label="Guest reviews" tabindex="0">' +
      '<button type="button" class="guest-reviews-btn guest-reviews-btn--prev" aria-label="Previous review">' +
      '<svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" d="M14 6 8 12l6 6"/></svg>' +
      "</button>" +
      '<div class="guest-reviews-viewport">' +
      '<ul class="guest-reviews-track" role="list">' +
      slidesHtml +
      "</ul>" +
      "</div>" +
      '<button type="button" class="guest-reviews-btn guest-reviews-btn--next" aria-label="Next review">' +
      '<svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" d="m10 6 6 6-6 6"/></svg>' +
      "</button>" +
      '<div class="guest-reviews-dots" role="tablist" aria-label="Review navigation">' +
      dotsHtml +
      "</div>" +
      '<p class="guest-reviews-live sr-only" aria-live="polite"></p>' +
      "</div>"
    );
  }

  function initSection(section) {
    var propertyFilter = (section.getAttribute("data-guest-reviews") || "").trim();
    var mount = section.querySelector("[data-guest-reviews-mount]");
    if (!mount) return;

    var reviews = REVIEWS.filter(function (review) {
      if (!propertyFilter) return true;
      return review.property === propertyFilter;
    });

    if (!reviews.length) {
      section.hidden = true;
      return;
    }

    mount.innerHTML = buildCarousel(reviews, !propertyFilter);
    initCarousel(mount.querySelector(".guest-reviews-carousel"), reviews);
  }

  document.querySelectorAll("[data-guest-reviews]").forEach(initSection);
})();
