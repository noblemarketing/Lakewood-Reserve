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
      dateLabel: "June 2026",
      text:
        "Me and my wife loved our stay at the Apex! We would definitely recommend it to anyone. Great communication, true to the description in the listing, excellent living space, and attention to detail. The wood fired hot tub was definitely a highlight!",
    },
    {
      property: "apex",
      propertyLabel: "The Apex",
      name: "Jess",
      location: "",
      rating: 5,
      dateLabel: "May 2026",
      text:
        "Our stay at The Apex was wonderful from beginning to end. What a gem in the heart of the Raystown region! The design and amenities clearly show intention and thought and we left incredibly rested and refreshed. We loved how nature and beauty surrounded you, both indoors and outdoors. We also enjoyed the short walk to the lake, paddleboarding, and hiking on a nearby trail. We are already looking forward to a return trip.",
    },
    {
      property: "apex",
      propertyLabel: "The Apex",
      name: "Dove",
      location: "",
      rating: 5,
      dateLabel: "June 2026",
      text:
        "We loved our stay here. It is in a very quiet and peaceful part of PA. The cabin was clean and the hosts were very communicative and had great information about the surrounding area. If you are looking for a quiet retreat we would definitely recommend!",
    },
    {
      property: "apex",
      propertyLabel: "The Apex",
      name: "Ryan",
      location: "",
      rating: 5,
      dateLabel: "June 2026",
      text:
        "The Apex was beautiful close enough to Raystown Lake. It was quiet and peaceful. Nice place to stay.",
    },
    {
      property: "anchor-28",
      propertyLabel: "Anchor Twenty Eight",
      name: "Audrey",
      location: "",
      rating: 5,
      dateLabel: "June 2026",
      text:
        "The amenities at Anchor Twenty Eight are incredible, and we loved how private the whole experience felt. From the thoughtful details inside to the outdoor spaces, everything was set up for a peaceful, restorative stay. We felt completely tucked away and could truly unwind.",
    },
    {
      property: "anchor-28",
      propertyLabel: "Anchor Twenty Eight",
      name: "Lauren",
      location: "",
      rating: 5,
      dateLabel: "July 2026",
      text:
        "We had such a great stay here with our family. It was exactly as pictured. We came with our two young kids and it ended up being the perfect mix of adventure and downtime. The space itself is really impressive. It feels simple and minimal in a very intentional way, but somehow still has every essential you could possibly need. That's not easy to pull off. Everything felt thoughtful and polished. It was so clean and exactly how it was described in the listing (maybe even better!) Our kids loved being outside and having space to explore. We cooked hot dogs and hamburgers over the fire which has an awesome grill to put over the pit. The location felt private and peaceful, but close enough to everything we wanted to do. It gave us some really good family time without needing to plan every second. Dan, Aubrey, and their team were great. Super helpful and responsive! We would love to come back",
    },
    {
      property: "anchor-28",
      propertyLabel: "Anchor Twenty Eight",
      name: "Walter",
      location: "",
      rating: 5,
      dateLabel: "June 2026",
      text: "The house was excelent, will go back again.",
    },
    {
      property: "anchor-28",
      propertyLabel: "Anchor Twenty Eight",
      name: "Nicole",
      location: "",
      rating: 5,
      dateLabel: "July 2026",
      text:
        "We loved our stay! It was such a nice little getaway house and so close to the lake. It was easy to get in and out and very close to a Boat launch that not busy. The house was very clean and described perfectly in the listing. We will definitely be looking to rebook in the future!",
    },
    {
      property: "anchor-28",
      propertyLabel: "Anchor Twenty Eight",
      name: "Phillip",
      location: "",
      rating: 5,
      dateLabel: "July 2026",
      text:
        "Great location near a boat launch on raystow, secluded and private cabin.",
    },
  ];

  var DESKTOP_QUERY = window.matchMedia("(min-width: 768px)");
  var REDUCED_MOTION_QUERY = window.matchMedia("(prefers-reduced-motion: reduce)");
  var AUTO_ROTATE_MS = 6000;
  var SCROLL_SETTLE_MS = 480;

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

  function renderReviewCard(review, logicalIndex, physicalIndex, showPropertyLabel) {
    var rating = 5;
    var avatarColor = AVATAR_COLORS[logicalIndex % AVATAR_COLORS.length];
    var propertyHtml =
      showPropertyLabel && review.propertyLabel
        ? '<p class="guest-review-card-property">' +
          escapeHtml(review.propertyLabel) +
          "</p>"
        : "";
    var dateHtml = review.dateLabel
      ? '<p class="guest-review-card-date">' + escapeHtml(review.dateLabel) + "</p>"
      : "";
    return (
      '<li class="guest-reviews-slide" role="group" aria-roledescription="slide" data-logical-index="' +
      logicalIndex +
      '" data-physical-index="' +
      physicalIndex +
      '">' +
      '<article class="guest-review-card" tabindex="0">' +
      '<div class="guest-review-card-stars" aria-label="Rated ' +
      rating +
      ' out of 5">' +
      renderStars(rating) +
      "</div>" +
      '<blockquote class="guest-review-card-text">' +
      "<p>" +
      escapeHtml(review.text) +
      "</p>" +
      '<span class="guest-review-card-more" hidden>Read more</span>' +
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
      dateHtml +
      propertyHtml +
      "</footer>" +
      "</article>" +
      "</li>"
    );
  }

  function getSlidesPerView() {
    return DESKTOP_QUERY.matches ? 2 : 1;
  }

  function buildLoopSlides(reviews) {
    if (reviews.length <= 1) return reviews.slice();
    return reviews.concat(reviews, reviews);
  }

  function initCarousel(root, reviews) {
    var loopEnabled = reviews.length > 1;
    var setSize = reviews.length;
    var physicalIndex = loopEnabled ? setSize : 0;
    var isProgrammaticScroll = false;
    var autoRotateTimer = null;
    var resumeTimer = null;
    var settleTimer = null;
    var hasExpandedCard = false;
    var viewport = root.querySelector(".guest-reviews-viewport");
    var track = root.querySelector(".guest-reviews-track");
    var slides = root.querySelectorAll(".guest-reviews-slide");
    var cards = root.querySelectorAll(".guest-review-card");
    var dotButtons = root.querySelectorAll(".guest-reviews-dot");
    var dotsWrap = root.querySelector(".guest-reviews-dots");
    var prevBtn = root.querySelector(".guest-reviews-btn--prev");
    var nextBtn = root.querySelector(".guest-reviews-btn--next");
    var live = root.querySelector(".guest-reviews-live");

    function logicalFromPhysical(i) {
      if (!setSize) return 0;
      return ((i % setSize) + setSize) % setSize;
    }

    function canScroll() {
      return loopEnabled;
    }

    function shouldAutoRotate() {
      return (
        canScroll() &&
        !hasExpandedCard &&
        !REDUCED_MOTION_QUERY.matches &&
        !document.hidden
      );
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

    function collapseAllCards() {
      for (var i = 0; i < cards.length; i += 1) {
        setCardExpanded(cards[i], false);
      }
      hasExpandedCard = false;
    }

    function updateActive() {
      var perView = getSlidesPerView();
      for (var i = 0; i < slides.length; i += 1) {
        var visible = !canScroll() || (i >= physicalIndex && i < physicalIndex + perView);
        slides[i].classList.toggle("is-active", i === physicalIndex);
        slides[i].setAttribute("aria-hidden", visible ? "false" : "true");
      }
    }

    function updateDots() {
      var logical = logicalFromPhysical(physicalIndex);
      for (var d = 0; d < dotButtons.length; d += 1) {
        var on = d === logical;
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
      if (!live || !reviews.length) return;
      var logical = logicalFromPhysical(physicalIndex);
      live.textContent =
        "Review " +
        (logical + 1) +
        " of " +
        reviews.length +
        " by " +
        reviews[logical].name;
    }

    function jumpWithoutAnimation(nextPhysical) {
      physicalIndex = nextPhysical;
      isProgrammaticScroll = true;
      viewport.scrollTo({
        left: getSlideOffset(physicalIndex),
        behavior: "auto",
      });
      window.requestAnimationFrame(function () {
        isProgrammaticScroll = false;
      });
    }

    function normalizeLoopPosition() {
      if (!loopEnabled) return;
      if (physicalIndex >= setSize * 2) {
        jumpWithoutAnimation(physicalIndex - setSize);
      } else if (physicalIndex < setSize) {
        jumpWithoutAnimation(physicalIndex + setSize);
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

      var offset = getSlideOffset(physicalIndex);
      isProgrammaticScroll = true;
      viewport.scrollTo({
        left: offset,
        behavior: smooth === false ? "auto" : "smooth",
      });

      if (settleTimer) window.clearTimeout(settleTimer);
      settleTimer = window.setTimeout(
        function () {
          normalizeLoopPosition();
          isProgrammaticScroll = false;
          updateActive();
          updateDots();
          announce();
        },
        smooth === false ? 0 : SCROLL_SETTLE_MS
      );
    }

    function syncIndexFromScroll() {
      if (isProgrammaticScroll || !canScroll()) return;

      var left = viewport.scrollLeft;
      var closest = 0;
      var minDist = Infinity;

      for (var i = 0; i < slides.length; i += 1) {
        var dist = Math.abs(getSlideOffset(i) - left);
        if (dist < minDist) {
          minDist = dist;
          closest = i;
        }
      }

      if (closest !== physicalIndex) {
        physicalIndex = closest;
        normalizeLoopPosition();
        updateActive();
        updateDots();
        announce();
      }
    }

    function refresh(smooth) {
      if (!loopEnabled) {
        physicalIndex = 0;
      } else if (physicalIndex < setSize || physicalIndex >= setSize * 2) {
        physicalIndex = setSize + logicalFromPhysical(physicalIndex);
      }
      updateScrollPosition(smooth);
      updateActive();
      updateDots();
      updateNav();
      announce();
    }

    function goToPhysical(nextPhysical, smooth) {
      if (!reviews.length) return;
      if (!canScroll()) {
        physicalIndex = 0;
        refresh(false);
        return;
      }
      collapseAllCards();
      physicalIndex = nextPhysical;
      refresh(smooth);
    }

    function goToLogical(logicalIndex, smooth) {
      if (!canScroll()) {
        goToPhysical(0, false);
        return;
      }
      var currentLogical = logicalFromPhysical(physicalIndex);
      var delta = logicalIndex - currentLogical;
      goToPhysical(physicalIndex + delta, smooth);
    }

    function advance() {
      if (!canScroll()) return;
      goToPhysical(physicalIndex + 1, true);
    }

    function retreat() {
      if (!canScroll()) return;
      goToPhysical(physicalIndex - 1, true);
    }

    function markExpandableCards() {
      for (var i = 0; i < cards.length; i += 1) {
        var card = cards[i];
        var textEl = card.querySelector(".guest-review-card-text p");
        var moreEl = card.querySelector(".guest-review-card-more");
        if (!textEl) continue;

        card.classList.remove("is-expanded");
        var overflows = textEl.scrollHeight > textEl.clientHeight + 1;
        card.classList.toggle("is-expandable", overflows);
        card.setAttribute("aria-expanded", "false");
        if (overflows) {
          card.setAttribute("role", "button");
          card.setAttribute("aria-label", "Expand review");
        } else {
          card.removeAttribute("role");
          card.removeAttribute("aria-label");
        }
        if (moreEl) {
          moreEl.hidden = !overflows;
          moreEl.textContent = "Read more";
        }
      }
    }

    function setCardExpanded(card, expanded) {
      if (!card || !card.classList.contains("is-expandable")) return;
      var moreEl = card.querySelector(".guest-review-card-more");
      card.classList.toggle("is-expanded", expanded);
      card.setAttribute("aria-expanded", expanded ? "true" : "false");
      card.setAttribute("aria-label", expanded ? "Collapse review" : "Expand review");
      if (moreEl) moreEl.textContent = expanded ? "Show less" : "Read more";
    }

    function toggleCard(card) {
      if (!card || !card.classList.contains("is-expandable")) return;
      var willExpand = !card.classList.contains("is-expanded");

      for (var i = 0; i < cards.length; i += 1) {
        if (cards[i] !== card) setCardExpanded(cards[i], false);
      }

      setCardExpanded(card, willExpand);
      hasExpandedCard = willExpand;

      if (willExpand) {
        stopAutoRotate();
      } else {
        startAutoRotate();
      }
    }

    if (track) {
      track.addEventListener("click", function (e) {
        var card = e.target.closest(".guest-review-card");
        if (!card || !root.contains(card)) return;
        toggleCard(card);
        resetAutoRotate();
      });

      track.addEventListener("keydown", function (e) {
        if (e.key !== "Enter" && e.key !== " ") return;
        var card = e.target.closest(".guest-review-card");
        if (!card || !root.contains(card)) return;
        e.preventDefault();
        toggleCard(card);
        resetAutoRotate();
      });
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
        goToLogical(idx, true);
        resetAutoRotate();
      }
    });

    root.addEventListener("keydown", function (e) {
      if (e.target.closest(".guest-review-card")) return;
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
      if (!hasExpandedCard) startAutoRotate();
    });
    root.addEventListener("focusin", function () {
      pauseAutoRotate();
    });
    root.addEventListener("focusout", function (e) {
      if (!root.contains(e.relatedTarget) && !hasExpandedCard) startAutoRotate();
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
      else if (!hasExpandedCard) startAutoRotate();
    });

    function bindMotionPreference(query) {
      var onChange = function () {
        if (query.matches) stopAutoRotate();
        else if (!hasExpandedCard) startAutoRotate();
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
        markExpandableCards();
      });
    } else if (typeof DESKTOP_QUERY.addListener === "function") {
      DESKTOP_QUERY.addListener(function () {
        refresh(false);
        markExpandableCards();
      });
    }

    window.addEventListener("resize", function () {
      collapseAllCards();
      refresh(false);
      markExpandableCards();
      startAutoRotate();
    });

    refresh(false);
    markExpandableCards();
    startAutoRotate();
  }

  function buildCarousel(reviews, showPropertyLabel) {
    var loopSlides = buildLoopSlides(reviews);
    var slidesHtml = loopSlides
      .map(function (review, physicalIndex) {
        var logicalIndex = physicalIndex % reviews.length;
        return renderReviewCard(review, logicalIndex, physicalIndex, showPropertyLabel);
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
