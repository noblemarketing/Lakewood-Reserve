(function () {
  "use strict";

  function initAccordion(root) {
    var tabs = root.querySelectorAll("[data-property-glance-tab]");
    var panels = root.querySelectorAll("[data-property-glance-panel]");
    if (!tabs.length || !panels.length) return;

    function activateTab(tab) {
      var panelId = tab.getAttribute("aria-controls");
      if (!panelId) return;

      for (var i = 0; i < tabs.length; i++) {
        var on = tabs[i] === tab;
        tabs[i].classList.toggle("is-active", on);
        tabs[i].setAttribute("aria-selected", on ? "true" : "false");
        tabs[i].tabIndex = on ? 0 : -1;
      }

      for (var j = 0; j < panels.length; j++) {
        var show = panels[j].id === panelId;
        panels[j].classList.toggle("is-active", show);
        panels[j].hidden = !show;
      }
    }

    root.addEventListener("click", function (e) {
      var tab = e.target.closest("[data-property-glance-tab]");
      if (!tab || !root.contains(tab)) return;
      activateTab(tab);
    });

    root.addEventListener("keydown", function (e) {
      var current = root.querySelector("[data-property-glance-tab][aria-selected='true']");
      if (!current) return;
      var list = Array.prototype.slice.call(tabs);
      var idx = list.indexOf(current);
      if (idx < 0) return;

      if (e.key === "ArrowRight" || e.key === "ArrowDown") {
        e.preventDefault();
        var next = list[(idx + 1) % list.length];
        next.focus();
        activateTab(next);
      } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
        e.preventDefault();
        var prev = list[(idx - 1 + list.length) % list.length];
        prev.focus();
        activateTab(prev);
      } else if (e.key === "Home") {
        e.preventDefault();
        list[0].focus();
        activateTab(list[0]);
      } else if (e.key === "End") {
        e.preventDefault();
        list[list.length - 1].focus();
        activateTab(list[list.length - 1]);
      }
    });

    var initial = root.querySelector("[data-property-glance-tab].is-active") || tabs[0];
    activateTab(initial);
  }

  function run() {
    document.querySelectorAll("[data-property-glance]").forEach(initAccordion);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", run);
  } else {
    run();
  }
})();
