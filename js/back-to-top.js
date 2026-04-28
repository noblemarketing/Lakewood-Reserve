(function () {
  if (document.getElementById("back-to-top")) return;

  var btn = document.createElement("button");
  btn.id = "back-to-top";
  btn.type = "button";
  btn.className = "back-to-top";
  btn.setAttribute("aria-label", "Back to top of page");
  btn.setAttribute("title", "Back to top");
  btn.setAttribute("aria-hidden", "true");
  btn.setAttribute("aria-live", "off");
  btn.innerHTML =
    '<svg class="back-to-top-progress" width="52" height="52" viewBox="0 0 52 52" aria-hidden="true" focusable="false">' +
    '<circle class="back-to-top-track" cx="26" cy="26" r="22"></circle>' +
    '<circle class="back-to-top-progress-stroke" cx="26" cy="26" r="22"></circle>' +
    "</svg>" +
    '<svg class="back-to-top-icon" width="22" height="22" viewBox="0 0 24 24" aria-hidden="true" focusable="false">' +
    '<path fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" d="M12 17V7"></path>' +
    '<path fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" d="M7.8 11.2 12 7l4.2 4.2"></path>' +
    '<path fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" d="M12 17v1.7"></path>' +
    '<path fill="none" stroke="currentColor" stroke-width="1.55" stroke-linecap="round" stroke-linejoin="round" d="M7.8 18.6c1 .85 2.3 1.35 4.2 1.35s3.2-.5 4.2-1.35"></path>' +
    '<path fill="none" stroke="currentColor" stroke-width="1.45" stroke-linecap="round" stroke-linejoin="round" d="M9.2 19.2l-1.4-1.2M14.8 19.2l1.4-1.2"></path>' +
    '<path fill="none" stroke="currentColor" stroke-width="1.35" stroke-linecap="round" stroke-linejoin="round" d="M7.8 18l.15 1.75 1.55-.4"></path>' +
    '<path fill="none" stroke="currentColor" stroke-width="1.35" stroke-linecap="round" stroke-linejoin="round" d="M16.2 18l-.15 1.75-1.55-.4"></path>' +
    "</svg>";
  document.body.appendChild(btn);

  var threshold = 200;
  var progressStroke = btn.querySelector(".back-to-top-progress-stroke");
  var radius = 22;
  var circumference = 2 * Math.PI * radius;

  if (progressStroke) {
    progressStroke.style.strokeDasharray = String(circumference);
    progressStroke.style.strokeDashoffset = String(circumference);
  }

  function updateState() {
    var show = window.scrollY > threshold;
    var scrollTop = window.scrollY || window.pageYOffset || 0;
    var maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    var progress = Math.min(1, Math.max(0, scrollTop / maxScroll));
    var dashOffset = circumference * (1 - progress);

    btn.classList.toggle("is-visible", show);
    btn.setAttribute("aria-hidden", show ? "false" : "true");

    if (progressStroke) {
      progressStroke.style.strokeDashoffset = String(dashOffset);
    }
  }

  window.addEventListener("scroll", updateState, { passive: true });
  window.addEventListener("resize", updateState, { passive: true });
  updateState();

  btn.addEventListener("click", function () {
    var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
    btn.blur();
  });
})();
