/* EU Compliance Suite – withdrawal function (Art. 11a Directive 2011/83/EU, § 356a BGB) */
(function () {
  "use strict";
  if (window.__euWithdrawalInit) return;
  window.__euWithdrawalInit = true;

  var EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

  function fill(template, values) {
    return String(template).replace(/\{(\w+)\}/g, function (m, key) {
      return values[key] !== undefined ? values[key] : m;
    });
  }

  function formatDate(iso, locale) {
    try {
      return new Date(iso).toLocaleString(locale || undefined, { dateStyle: "long", timeStyle: "medium" });
    } catch (e) {
      return iso;
    }
  }

  function setup(root) {
    if (root.__euReady) return;
    root.__euReady = true;
    var dialog = root.querySelector("dialog");
    var steps = {
      form: root.querySelector('[data-step="form"]'),
      review: root.querySelector('[data-step="review"]'),
      success: root.querySelector('[data-step="success"]')
    };
    var form = root.querySelector(".eu-wd__form");
    var confirmBtn = root.querySelector('[data-action="confirm"]');
    var t = root.dataset;
    var data = null;

    function show(name) {
      Object.keys(steps).forEach(function (k) { steps[k].hidden = k !== name; });
      var heading = steps[name].querySelector(".eu-wd__title");
      if (heading) { heading.setAttribute("tabindex", "-1"); heading.focus(); }
    }

    function setError(field, message) {
      var el = root.querySelector('[data-error-for="' + field + '"]');
      if (el) el.textContent = message || "";
      var input = form.querySelector('[name="' + field + '"]');
      if (input) input.setAttribute("aria-invalid", message ? "true" : "false");
    }

    function collect() {
      var fd = new FormData(form);
      var values = {
        consumerName: String(fd.get("consumerName") || "").trim(),
        contractRef: String(fd.get("contractRef") || "").trim(),
        contactEmail: String(fd.get("contactEmail") || "").trim(),
        orderDate: String(fd.get("orderDate") || "").trim(),
        details: String(fd.get("details") || "").trim(),
        website: String(fd.get("website") || ""),
        locale: t.locale || ""
      };
      var ok = true;
      ["consumerName", "contractRef", "contactEmail"].forEach(function (f) { setError(f, ""); });
      if (values.consumerName.length < 2) { setError("consumerName", t.tRequired); ok = false; }
      if (!values.contractRef) { setError("contractRef", t.tRequired); ok = false; }
      if (!EMAIL_RE.test(values.contactEmail)) { setError("contactEmail", t.tEmail); ok = false; }
      return ok ? values : null;
    }

    function open() {
      data = null;
      show("form");
      setError("global", "");
      if (typeof dialog.showModal === "function") dialog.showModal();
      else dialog.setAttribute("open", "");
    }

    function close() {
      if (dialog.open) dialog.close();
      else dialog.removeAttribute("open");
    }

    form.addEventListener("submit", function (ev) {
      ev.preventDefault();
      var values = collect();
      if (!values) return;
      data = values;
      ["consumerName", "contractRef", "contactEmail", "orderDate", "details"].forEach(function (f) {
        var dd = root.querySelector('[data-summary="' + f + '"]');
        var dt = root.querySelector('[data-optional="' + f + '"]');
        if (dd) dd.textContent = values[f];
        if (dt) { dt.hidden = !values[f]; dd.hidden = !values[f]; }
      });
      show("review");
    });

    root.querySelectorAll('[data-action="back"]').forEach(function (b) {
      b.addEventListener("click", function () { show("form"); });
    });
    root.querySelectorAll('[data-action="close"]').forEach(function (b) {
      b.addEventListener("click", close);
    });
    root.querySelectorAll('[data-action="print"]').forEach(function (b) {
      b.addEventListener("click", function () { window.print(); });
    });

    // Confirmation function (Art. 11a(3)): submits the statement.
    confirmBtn.addEventListener("click", function () {
      if (!data || confirmBtn.disabled) return;
      var original = confirmBtn.textContent;
      confirmBtn.disabled = true;
      confirmBtn.textContent = t.tSubmitting || original;
      setError("global", "");
      fetch(t.endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Accept": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify(data)
      })
        .then(function (res) {
          return res.json().then(function (body) { return { status: res.status, body: body }; }).catch(function () { return { status: res.status, body: {} }; });
        })
        .then(function (r) {
          if (r.status === 200 && r.body && r.body.ok) {
            var when = formatDate(r.body.submittedAt, t.locale);
            var text = fill(r.body.ackSent ? t.tSuccess : t.tSuccessNomail, { date: when, receipt: r.body.receiptNo, email: data.contactEmail });
            root.querySelector("[data-success-text]").textContent = text;
            root.querySelector("[data-receipt]").textContent = r.body.receiptNo;
            root.querySelector("[data-submitted-at]").textContent = when + " (" + r.body.submittedAt + ")";
            show("success");
            form.reset();
          } else if (r.status === 429) {
            setError("global", t.tRate);
          } else {
            setError("global", t.tGeneric);
          }
        })
        .catch(function () { setError("global", t.tGeneric); })
        .then(function () {
          confirmBtn.disabled = false;
          confirmBtn.textContent = original;
        });
    });

    root.__euOpen = open;
  }

  function initAll() {
    document.querySelectorAll("[data-eu-withdrawal]").forEach(setup);
    document.querySelectorAll("[data-eu-withdrawal-open]").forEach(function (btn) {
      if (btn.__euBound) return;
      btn.__euBound = true;
      btn.addEventListener("click", function () {
        var root = document.getElementById(btn.getAttribute("data-eu-withdrawal-open")) || document.querySelector("[data-eu-withdrawal]");
        if (root && root.__euOpen) root.__euOpen();
      });
    });
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", initAll);
  else initAll();
  document.addEventListener("shopify:section:load", initAll);
  document.addEventListener("shopify:block:select", initAll);
})();
