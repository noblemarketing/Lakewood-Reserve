(function () {
  "use strict";

  var STAR_PATH =
    "M12 2.5l2.9 6.1 6.8.6-5.1 4.5 1.5 6.6L12 17.8l-6.1 3.5 1.5-6.6-5.1-4.5 6.8-.6L12 2.5z";

  var REVIEWS = [
    {
      property: "apex",
      propertyLabel: "The Apex",
      name: "Nick",
      location: "",
      rating: 5,
      dateLabel: "September 2026",
      text:
        "This was everything we needed and more as a getaway for our anniversary. It was the perfect layout for anyone needing to get away and unwind and enjoy the tranquility and stillness of life. From the beautiful picture window allowing us to take in the scenery, to the king sized bed that was like sleeping on a cloud, to the wood-fired hot tub that made enjoy that space even more relaxing. Everything was perfect and I couldn't have been more satisfied with our stay, even more so we will be bringing our kids and coming back!",
    },
    {
      property: "apex",
      propertyLabel: "The Apex",
      name: "Jessica",
      location: "Philadelphia, Pennsylvania",
      rating: 5,
      dateLabel: "August 2026",
      text:
        "What a beautiful space that far exceeded the photos. I absolutely loved it all and am already looking forward to returning. Communication was great, location was private, and everything was absolutely perfect. You can tell a lot of thought went into the design and layout, which is always fun to be able to experience. Incredibly grateful for it all.",
    },
    {
      property: "apex",
      propertyLabel: "The Apex",
      name: "Michelle",
      location: "",
      rating: 5,
      dateLabel: "August 2026",
      text: "Wonderful stay very relaxing beautiful",
    },
    {
      property: "apex",
      propertyLabel: "The Apex",
      name: "Heidi",
      location: "Philadelphia, Pennsylvania",
      rating: 5,
      dateLabel: "August 2026",
      text: "Perfect!",
    },
    {
      property: "apex",
      propertyLabel: "The Apex",
      name: "Kendall",
      location: "Myrtle Beach, South Carolina",
      rating: 5,
      dateLabel: "August 2026",
      text: "Absolutely loved our time here!",
    },
    {
      property: "apex",
      propertyLabel: "The Apex",
      name: "Chris",
      location: "",
      rating: 5,
      dateLabel: "August 2026",
      text:
        "This place is everything that you think it would be when you see the pictures. We had such a great time. Very nice and relaxing. We loved the recommendations in the booklet, specifically backwoods smoke shack. Great bbq! I have already recommended this place to so many people. 10/10 experience",
    },
    {
      property: "apex",
      propertyLabel: "The Apex",
      name: "Sofiia",
      location: "",
      rating: 5,
      dateLabel: "August 2026",
      text:
        "We spent an incredible weekend at this beautiful place. Everything felt private, new, and thoughtfully designed down to the smallest detail. It was so cozy, warm, and beautiful. This is the perfect place to escape everyday life, slow down, and enjoy a peaceful retreat in nature. The aesthetic is absolutely amazing, and the entire space feels incredibly welcoming. We will definitely be coming back again and again!",
    },
    {
      property: "apex",
      propertyLabel: "The Apex",
      name: "Kennedy",
      location: "",
      rating: 5,
      dateLabel: "July 2026",
      text:
        "Absolutely loved our time here. The location was excellent - peaceful, private, but near lots of awesome fishing spots. The house was clean, had everything we needed, and the amenities were perfect. They were incredibly responsive if we had any issues or any questions. Will definitely be coming back!",
    },
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
      name: "Jason",
      location: "Malvern, Pennsylvania",
      rating: 5,
      dateLabel: "September 2026",
      text:
        "My family and I had a great time staying at the Tiny House. We had tickets to a Penn State game and decided to stay at Raytown Lake for the weekend. We brought a boat with us and went out on the lake for a day. Two adults and four young kids. The house certainly is tight, but it was enough room for us!",
    },
    {
      property: "anchor-28",
      propertyLabel: "Anchor Twenty Eight",
      name: "Matthew",
      location: "",
      rating: 5,
      dateLabel: "August 2026",
      text: "Great secluded spot near the lake!",
    },
    {
      property: "anchor-28",
      propertyLabel: "Anchor Twenty Eight",
      name: "Loren",
      location: "Sterling, Virginia",
      rating: 5,
      dateLabel: "August 2026",
      text: "We had a great stay. Cute tiny home.",
    },
    {
      property: "anchor-28",
      propertyLabel: "Anchor Twenty Eight",
      name: "Devon",
      location: "Pittsburgh, Pennsylvania",
      rating: 5,
      dateLabel: "August 2026",
      text: "Within 15-30 minutes of most local attractions.",
    },
    {
      property: "anchor-28",
      propertyLabel: "Anchor Twenty Eight",
      name: "Brian",
      location: "Fanwood, New Jersey",
      rating: 5,
      dateLabel: "August 2026",
      text:
        "Our stay at Anchor Twenty Eight was delightful. The location is great, private and inviting. The house is just as in the pictures; new, clean, functional and comfortable. It is nicely appointed with all the important \"stuff\". The homeowners were very thoughtful in outfitting the house. We thoroughly enjoyed the screened-in porch; the best part about the house. Coffee in the morning, watching the storms roll through in the afternoons, dinner and a glass of wine in the evenings... and no bugs! A very nice extension to the main living space. Although we were not there to take advantage of Raystown Lake, we were close to the Allegrippis mountain biking trail system which was the activity for the weekend... and only 30 minutes from the house. I'm sure the lake would provide even more options. Given the heat, we were not able to take advantage of the sauna, but I would imagine in the Fall that would be very nice too. We'll be back! Thanks Dan!!",
    },
    {
      property: "anchor-28",
      propertyLabel: "Anchor Twenty Eight",
      name: "Elizabeth",
      location: "Quakertown, Pennsylvania",
      rating: 5,
      dateLabel: "August 2026",
      text:
        "This house is amazing. The photos depict the house and the grounds perfectly. It was nestled in the woods with a firepit and a sauna for your use only. It was fun to sit in the loft, but my favorite part was the large screened in porch. We had a rainy day and the peacefulness of listening to the rain on the roof and watching it in the trees was perfect. Cleanliness and having everything you could need seems to be a top priority for Dan. Even though this house is small, you don't feel squished in it at all. There was much more room than I expected with all the amenities needed. The lake really is only minutes away too. I really enjoyed my stay and will gladly return.",
    },
    {
      property: "anchor-28",
      propertyLabel: "Anchor Twenty Eight",
      name: "Stephanie",
      location: "York, Pennsylvania",
      rating: 5,
      dateLabel: "August 2026",
      text:
        "My family had a wonderful time. We did a lot of fishing around Raystown on this trip. We caught bass, crappie and bluegill at the several spots we visited. Every morning we woke up and took a 3 mile hike. The neighborhood is peaceful and quiet. We also visited nearby Saxton and found a great little coffee shop, grocery store, as well as the tavern restaurant for dinner one night. The house was definitely spacious enough for our family of 4 and we enjoyed eating out on the covered, screened-in porch for breakfast. We are already talking about when we can go back again!",
    },
    {
      property: "anchor-28",
      propertyLabel: "Anchor Twenty Eight",
      name: "Lance",
      location: "Pittsburgh, Pennsylvania",
      rating: 5,
      dateLabel: "July 2026",
      text:
        "The property was just what my family needed for a weekend away. Waking up to the sound of the birds was fantastic. We have two boys under the age of 12 and they loved the outdoor tree swing and the access to the surrounding forest and lake. The kitchen was equipped with just what we needed and nothing more. The local fresh ground coffee was a wonderful touch. My wife and I sat on the screened in porch to have an early morning cup together. While we didn't use the sauna, I could see it and the fire pit being a great touch for fall/winter visits. We'll be back if the opportunity comes up again. Thanks for the hospitality.",
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

  var PREVIEW_LIMIT = 150;
  var PX_PER_SEC = 28;
  var REDUCED_MOTION_QUERY = window.matchMedia("(prefers-reduced-motion: reduce)");

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

  function previewFromText(text) {
    var full = String(text || "").trim();
    if (full.length <= PREVIEW_LIMIT) {
      return { preview: full, truncated: false, full: full };
    }
    return {
      preview: full.slice(0, PREVIEW_LIMIT).replace(/\s+$/, "") + "...",
      truncated: true,
      full: full,
    };
  }

  function renderReviewCard(review, hiddenCopy) {
    var rating = 5;
    var preview = previewFromText(review.text);
    var locationHtml = review.location
      ? '<p class="guest-review-card-location">' + escapeHtml(review.location) + "</p>"
      : "";
    var propertyHtml = review.propertyLabel
      ? '<p class="guest-review-card-property">' +
        escapeHtml(review.propertyLabel) +
        "</p>"
      : "";
    var dateHtml = review.dateLabel
      ? '<p class="guest-review-card-date">' + escapeHtml(review.dateLabel) + "</p>"
      : "";
    var moreHtml = preview.truncated
      ? '<button type="button" class="guest-review-card-more">Read more</button>'
      : "";
    return (
      '<li class="guest-reviews-slide">' +
      '<article class="guest-review-card' +
      (preview.truncated ? " is-expandable" : "") +
      '"' +
      (hiddenCopy ? " aria-hidden=\"true\"" : "") +
      (preview.truncated
        ? ' data-preview="' +
          escapeHtml(preview.preview) +
          '" data-full="' +
          escapeHtml(preview.full) +
          '"'
        : "") +
      ">" +
      '<div class="guest-review-card-stars" aria-label="Rated ' +
      rating +
      ' out of 5">' +
      renderStars(rating) +
      "</div>" +
      '<blockquote class="guest-review-card-text">' +
      "<p>" +
      escapeHtml(preview.preview) +
      "</p>" +
      moreHtml +
      "</blockquote>" +
      '<footer class="guest-review-card-footer">' +
      '<cite class="guest-review-card-name">' +
      escapeHtml(review.name) +
      "</cite>" +
      locationHtml +
      dateHtml +
      propertyHtml +
      "</footer>" +
      "</article>" +
      "</li>"
    );
  }

  function renderSet(reviews, hiddenCopy) {
    return (
      '<ul class="guest-reviews-set" role="' +
      (hiddenCopy ? "presentation" : "list") +
      '"' +
      (hiddenCopy ? " aria-hidden=\"true\"" : "") +
      ">" +
      reviews
        .map(function (review) {
          return renderReviewCard(review, hiddenCopy);
        })
        .join("") +
      "</ul>"
    );
  }

  function buildMarquee(reviews) {
    var loop = reviews.length > 1;
    return (
      '<div class="guest-reviews-marquee" role="region" aria-label="Guest reviews">' +
      '<div class="guest-reviews-viewport">' +
      '<div class="guest-reviews-track">' +
      renderSet(reviews, false) +
      (loop ? renderSet(reviews, true) : "") +
      "</div>" +
      "</div>" +
      "</div>"
    );
  }

  function initMarquee(root) {
    var track = root.querySelector(".guest-reviews-track");
    var firstSet = root.querySelector(".guest-reviews-set");
    if (!track || !firstSet) return;

    var reduced = REDUCED_MOTION_QUERY.matches;
    var looping = root.querySelectorAll(".guest-reviews-set").length > 1;

    function setDuration() {
      if (!looping || reduced) {
        track.style.animationDuration = "0s";
        return;
      }
      var styles = window.getComputedStyle(track);
      var gap = parseFloat(styles.columnGap || styles.gap) || 0;
      var distance = firstSet.offsetWidth + gap;
      var seconds = Math.max(24, distance / PX_PER_SEC);
      track.style.setProperty("--guest-reviews-distance", "-" + distance + "px");
      track.style.animationDuration = seconds + "s";
    }

    function anyExpanded() {
      return Boolean(root.querySelector(".guest-review-card.is-expanded"));
    }

    function syncPaused() {
      root.classList.toggle("is-paused", anyExpanded());
    }

    function setCardExpanded(card, expanded) {
      if (!card || !card.classList.contains("is-expandable")) return;
      var textEl = card.querySelector(".guest-review-card-text p");
      var moreEl = card.querySelector(".guest-review-card-more");
      var full = card.getAttribute("data-full") || "";
      var preview = card.getAttribute("data-preview") || "";
      card.classList.toggle("is-expanded", expanded);
      card.setAttribute("aria-expanded", expanded ? "true" : "false");
      if (textEl) textEl.textContent = expanded ? full : preview;
      if (moreEl) moreEl.textContent = expanded ? "Show less" : "Read more";
    }

    function toggleCard(card) {
      if (!card || !card.classList.contains("is-expandable")) return;
      var willExpand = !card.classList.contains("is-expanded");
      var cards = root.querySelectorAll(".guest-review-card.is-expandable");
      for (var i = 0; i < cards.length; i += 1) {
        if (cards[i] !== card) setCardExpanded(cards[i], false);
      }
      setCardExpanded(card, willExpand);
      syncPaused();
    }

    root.querySelectorAll(".guest-review-card.is-expandable").forEach(function (card) {
      card.setAttribute("aria-expanded", "false");
    });

    root.addEventListener("click", function (e) {
      var card = e.target.closest(".guest-review-card.is-expandable");
      if (!card || !root.contains(card)) return;
      e.preventDefault();
      toggleCard(card);
    });

    function bindMotionPreference(query) {
      var onChange = function () {
        reduced = query.matches;
        root.classList.toggle("guest-reviews-marquee--static", reduced || !looping);
        setDuration();
      };
      if (typeof query.addEventListener === "function") {
        query.addEventListener("change", onChange);
      } else if (typeof query.addListener === "function") {
        query.addListener(onChange);
      }
    }

    bindMotionPreference(REDUCED_MOTION_QUERY);
    root.classList.toggle("guest-reviews-marquee--static", reduced || !looping);

    window.addEventListener("resize", function () {
      setDuration();
    });

    setDuration();
    window.requestAnimationFrame(setDuration);
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(setDuration);
    }
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

    mount.innerHTML = buildMarquee(reviews);
    initMarquee(mount.querySelector(".guest-reviews-marquee"));
  }

  document.querySelectorAll("[data-guest-reviews]").forEach(initSection);
})();
