const fadeSections = document.querySelectorAll(".section-fade");

if ("IntersectionObserver" in window && fadeSections.length) {
  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        obs.unobserve(entry.target);
      });
    },
    {
      threshold: 0.2,
      rootMargin: "0px 0px -60px 0px"
    }
  );

  fadeSections.forEach((section) => observer.observe(section));
} else {
  fadeSections.forEach((section) => section.classList.add("is-visible"));
}

const reviewCards = Array.from(document.querySelectorAll(".review-card"));
const prevBtn = document.querySelector(".testimonials-arrow.prev");
const nextBtn = document.querySelector(".testimonials-arrow.next");

let activeIndex = 0;

const testimonialsShowPair = () => window.matchMedia("(min-width: 768px)").matches;

const updateReviewVisibility = () => {
  if (!reviewCards.length) return;
  const n = reviewCards.length;
  const wide = testimonialsShowPair();
  reviewCards.forEach((card, i) => {
    const visible = wide
      ? i === activeIndex % n || i === (activeIndex + 1) % n
      : i === activeIndex % n;
    card.classList.toggle("review-card--visible", visible);
    card.setAttribute("aria-hidden", visible ? "false" : "true");
  });
};

const stepTestimonials = (delta) => {
  const n = reviewCards.length;
  if (!n) return;
  activeIndex = (activeIndex + delta + n * 100) % n;
  updateReviewVisibility();
};

if (reviewCards.length) {
  updateReviewVisibility();
  prevBtn?.addEventListener("click", () => stepTestimonials(-1));
  nextBtn?.addEventListener("click", () => stepTestimonials(1));
  let resizeTimer;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(updateReviewVisibility, 120);
  });
}
