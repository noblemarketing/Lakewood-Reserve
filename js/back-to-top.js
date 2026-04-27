(function () {
  if (document.getElementById("back-to-top")) return;

  var btn = document.createElement("button");
  btn.id = "back-to-top";
  btn.type = "button";
  btn.className = "back-to-top";
  btn.setAttribute("aria-label", "Back to top of page");
  btn.setAttribute("title", "Back to top");
  btn.setAttribute("aria-hidden", "true");
  btn.innerHTML =
    '<svg class="back-to-top-icon" width="22" height="22" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" d="M12 19V5M5 12l7-7 7 7"/></svg>';
  document.body.appendChild(btn);

  var threshold = 200;

  function updateVisibility() {
    var show = window.scrollY > threshold;
    btn.classList.toggle("is-visible", show);
    btn.setAttribute("aria-hidden", show ? "false" : "true");
  }

  window.addEventListener("scroll", updateVisibility, { passive: true });
  updateVisibility();

  btn.addEventListener("click", function () {
    var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
    btn.blur();
  });
})();
