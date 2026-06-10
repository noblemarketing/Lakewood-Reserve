(function () {
  "use strict";

  var STAR_PATH =
    "M12 2.5l2.9 6.1 6.8.6-5.1 4.5 1.5 6.6L12 17.8l-6.1 3.5 1.5-6.6-5.1-4.5 6.8-.6L12 2.5z";

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
      name: "Jessica",
      location: "",
      rating: 5,
      dateLabel: "Recent stay",
      text:
        "Our stay at The Apex was wonderful from beginning to end. What a gem in the heart of the Raystown region! The design and amenities clearly show intention and thought and we left incredibly rested and refreshed. We loved how nature and beauty surrounded you, both indoors and outdoors. We also enjoyed the short walk to the lake, paddleboarding, and hiking on a nearby trail. We are already looking forward to a return trip.",
    },
  ];

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

  function renderMeta(review, propertyFilter) {
    var parts = [review.dateLabel];
    if (!propertyFilter && review.propertyLabel) {
      parts.push(review.propertyLabel);
    }
    return parts.filter(Boolean).join(" · ");
  }

  function renderReview(review, propertyFilter) {
    var rating = Math.max(0, Math.min(5, review.rating || 5));
    return (
      "<li>" +
      '<article class="guest-review">' +
      '<header class="guest-review-header">' +
      '<div class="guest-review-identity">' +
      '<cite class="guest-review-name">' +
      escapeHtml(review.name) +
      "</cite>" +
      '<p class="guest-review-location">' +
      escapeHtml(review.location) +
      "</p>" +
      "</div>" +
      "</header>" +
      '<div class="guest-review-rating" aria-label="Rated ' +
      rating +
      ' out of 5">' +
      '<span class="guest-review-stars" aria-hidden="true">' +
      renderStars(rating) +
      "</span>" +
      '<span class="guest-review-meta">' +
      escapeHtml(renderMeta(review, propertyFilter)) +
      "</span>" +
      "</div>" +
      '<blockquote class="guest-review-text">' +
      "<p>" +
      escapeHtml(review.text) +
      "</p>" +
      "</blockquote>" +
      "</article>" +
      "</li>"
    );
  }

  function initSection(section) {
    var propertyFilter = (section.getAttribute("data-guest-reviews") || "").trim();
    var list = section.querySelector("[data-guest-reviews-list]");
    if (!list) return;

    var reviews = REVIEWS.filter(function (review) {
      if (!propertyFilter) return true;
      return review.property === propertyFilter;
    });

    if (!reviews.length) {
      section.hidden = true;
      return;
    }

    list.innerHTML = reviews.map(function (review) {
      return renderReview(review, propertyFilter);
    }).join("");
  }

  document.querySelectorAll("[data-guest-reviews]").forEach(initSection);
})();
