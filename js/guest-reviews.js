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
      property: "cascade",
      propertyLabel: "The Cascade",
      name: "Audrey",
      location: "",
      rating: 5,
      dateLabel: "Recent stay",
      text:
        "The amenities at The Cascade are incredible, and we loved how private the whole experience felt. From the thoughtful details inside to the outdoor spaces, everything was set up for a peaceful, restorative stay. We felt completely tucked away and could truly unwind.",
    },
  ];

  var DESKTOP_QUERY = window.matchMedia("(min-width: 768px)");

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
    return DESKTOP_QUERY.matches ? 3 : 1;
  }

  function initCarousel(root, reviews) {
    var index = 0;
    var track = root.querySelector(".guest-reviews-track");
    var viewport = root.querySelector(".guest-reviews-viewport");
    var slides = track.querySelectorAll(".guest-reviews-slide");
    var dotButtons = root.querySelectorAll(".guest-reviews-dot");
    var dotsWrap = root.querySelector(".guest-reviews-dots");
    var prevBtn = root.querySelector(".guest-reviews-btn--prev");
    var nextBtn = root.querySelector(".guest-reviews-btn--next");
    var live = root.querySelector(".guest-reviews-live");

    function maxIndex() {
      return Math.max(0, reviews.length - getSlidesPerView());
    }

    function canScroll() {
      return reviews.length > getSlidesPerView();
    }

    function updateActive() {
      var perView = getSlidesPerView();
      for (var i = 0; i < slides.length; i += 1) {
        slides[i].classList.toggle("is-active", i === index);
        var visible = canScroll() ? i >= index && i < index + perView : true;
        slides[i].setAttribute("aria-hidden", visible ? "false" : "true");
      }
    }

    function updateTransform() {
      if (!canScroll()) {
        track.style.transform = "translateX(0)";
        return;
      }
      var slide = slides[0];
      if (!slide) return;
      var offset = index * slide.offsetWidth;
      track.style.transform = "translateX(-" + offset + "px)";
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

    function refresh() {
      if (canScroll() && index > maxIndex()) index = maxIndex();
      if (!canScroll() && index > reviews.length - 1) index = reviews.length - 1;
      updateTransform();
      updateActive();
      updateDots();
      updateNav();
      announce();
    }

    function goTo(i) {
      if (!reviews.length) return;
      if (canScroll()) {
        index = Math.max(0, Math.min(maxIndex(), i));
      } else {
        index = Math.max(0, Math.min(reviews.length - 1, i));
      }
      refresh();
    }

    prevBtn.addEventListener("click", function () {
      goTo(index - 1);
    });
    nextBtn.addEventListener("click", function () {
      goTo(index + 1);
    });

    root.querySelector(".guest-reviews-dots").addEventListener("click", function (e) {
      var dot = e.target.closest(".guest-reviews-dot");
      if (!dot || !root.contains(dot)) return;
      var idx = parseInt(dot.getAttribute("data-index"), 10);
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

    if (typeof DESKTOP_QUERY.addEventListener === "function") {
      DESKTOP_QUERY.addEventListener("change", refresh);
    } else if (typeof DESKTOP_QUERY.addListener === "function") {
      DESKTOP_QUERY.addListener(refresh);
    }

    window.addEventListener("resize", refresh);
    refresh();
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
