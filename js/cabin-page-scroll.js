/**
 * Cabin listing pages: always start at the top (no hash jump, no restored scroll).
 * In-page links to #book / #booking-panel still work after load when clicked.
 */
(function () {
  function scrollToTop() {
    window.scrollTo(0, 0);
  }

  if ("scrollRestoration" in history) {
    history.scrollRestoration = "manual";
  }

  if (window.location.hash) {
    const path = window.location.pathname + window.location.search;
    history.replaceState(null, "", path);
  }

  scrollToTop();

  window.addEventListener("load", scrollToTop);

  window.addEventListener("pageshow", function (event) {
    if (event.persisted) {
      scrollToTop();
    }
  });
})();
