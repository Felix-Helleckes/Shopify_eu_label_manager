/* EU Compliance Suite – nested display of the GARAN label (Annex II Reg. (EU) 2025/1960):
   the full label appears on the first click, roll-over or touch. */
(function () {
  "use strict";
  function init() {
    document.querySelectorAll("[data-eu-garan-toggle]").forEach(function (btn) {
      if (btn.__euBound) return;
      btn.__euBound = true;
      var full = btn.parentElement.querySelector(".eu-garan__full");
      function expand() {
        full.hidden = false;
        btn.setAttribute("aria-expanded", "true");
      }
      btn.addEventListener("click", function () {
        if (full.hidden) expand(); else { full.hidden = true; btn.setAttribute("aria-expanded", "false"); }
      });
      btn.addEventListener("mouseenter", expand);
      btn.addEventListener("focus", expand);
      btn.addEventListener("touchstart", expand, { passive: true });
    });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init); else init();
  document.addEventListener("shopify:section:load", init);
})();
