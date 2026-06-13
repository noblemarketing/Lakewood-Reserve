(function () {
  "use strict";

  var catalog = null;
  var propertyCards = {};

  function formatMoney(cents) {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(cents / 100);
  }

  function byId(id) {
    return document.getElementById(id);
  }

  function buildQuantityOptions(maxQuantity) {
    var html = "";
    for (var i = 0; i <= maxQuantity; i += 1) {
      html +=
        '<option value="' +
        i +
        '">' +
        (i === 0 ? "None" : i + (i === 1 ? " item" : " items")) +
        "</option>";
    }
    return html;
  }

  function buildDurationOptions(durations, prices) {
    return durations
      .map(function (duration) {
        var price = prices[duration.id];
        return (
          '<option value="' +
          duration.id +
          '">' +
          duration.label +
          " — " +
          formatMoney(price) +
          " each</option>"
        );
      })
      .join("");
  }

  function renderPropertyCard(property, durations) {
    return (
      '<article class="rent-property-card" data-property-id="' +
      property.id +
      '">' +
      "<h2>" +
      property.name +
      " — " +
      property.equipment.label +
      "</h2>" +
      '<div class="rent-fields">' +
      '<div class="rent-field">' +
      '<label for="rent-qty-' +
      property.id +
      '">Quantity</label>' +
      '<select id="rent-qty-' +
      property.id +
      '" data-rent-qty>' +
      buildQuantityOptions(property.equipment.maxQuantity) +
      "</select>" +
      "</div>" +
      '<div class="rent-field">' +
      '<label for="rent-duration-' +
      property.id +
      '">Rental duration</label>' +
      '<select id="rent-duration-' +
      property.id +
      '" data-rent-duration>' +
      buildDurationOptions(durations, property.equipment.prices) +
      "</select>" +
      "</div>" +
      "</div>" +
      '<p class="rent-line-total" data-rent-line-total>$0.00</p>' +
      "</article>"
    );
  }

  function getLineTotal(property, qty, durationId) {
    if (!qty) return 0;
    var unit = property.equipment.prices[durationId];
    return unit ? unit * qty : 0;
  }

  function updateTotals() {
    if (!catalog) return;

    var grandTotal = 0;
    var selectedCount = 0;

    catalog.properties.forEach(function (property) {
      var card = propertyCards[property.id];
      if (!card) return;

      var qty = parseInt(card.qtySelect.value, 10) || 0;
      var durationId = card.durationSelect.value;
      var lineTotal = getLineTotal(property, qty, durationId);

      card.lineTotalEl.textContent = qty > 0 ? formatMoney(lineTotal) : "$0.00";
      grandTotal += lineTotal;
      if (qty > 0) selectedCount += 1;
    });

    byId("rent-grand-total").textContent = formatMoney(grandTotal);
    byId("rent-now-btn").disabled = grandTotal <= 0;
    byId("rent-error").hidden = true;
  }

  function collectItems() {
    var items = [];
    catalog.properties.forEach(function (property) {
      var card = propertyCards[property.id];
      var qty = parseInt(card.qtySelect.value, 10) || 0;
      if (qty < 1) return;
      items.push({
        propertyId: property.id,
        durationId: card.durationSelect.value,
        quantity: qty,
      });
    });
    return items;
  }

  function bindEvents() {
    catalog.properties.forEach(function (property) {
      var card = propertyCards[property.id];
      card.qtySelect.addEventListener("change", updateTotals);
      card.durationSelect.addEventListener("change", updateTotals);
    });

    byId("rent-now-btn").addEventListener("click", startCheckout);
  }

  async function startCheckout() {
    var btn = byId("rent-now-btn");
    var errorEl = byId("rent-error");
    var items = collectItems();

    if (!items.length) {
      errorEl.textContent = "Select at least one item to rent.";
      errorEl.hidden = false;
      return;
    }

    btn.disabled = true;
    btn.textContent = "Redirecting…";
    errorEl.hidden = true;

    try {
      var response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: items }),
      });

      var data = await response.json();
      if (!response.ok || !data.url) {
        throw new Error(data.error || "Checkout failed");
      }

      window.location.href = data.url;
    } catch (err) {
      errorEl.textContent = err.message || "Unable to start checkout. Please try again.";
      errorEl.hidden = false;
      btn.disabled = false;
      btn.textContent = "Rent now";
      updateTotals();
    }
  }

  function initCatalog(data) {
    catalog = data;
    var grid = byId("rent-property-grid");
    grid.innerHTML = data.properties
      .map(function (property) {
        return renderPropertyCard(property, data.durations);
      })
      .join("");

    data.properties.forEach(function (property) {
      propertyCards[property.id] = {
        qtySelect: grid.querySelector('#rent-qty-' + property.id),
        durationSelect: grid.querySelector('#rent-duration-' + property.id),
        lineTotalEl: grid.querySelector(
          '[data-property-id="' + property.id + '"] [data-rent-line-total]'
        ),
      };
    });

    byId("rent-loading").hidden = true;
    grid.hidden = false;
    byId("rent-summary").hidden = false;
    bindEvents();
    updateTotals();
  }

  async function loadCatalog() {
    try {
      var response = await fetch("/api/rental-catalog");
      if (!response.ok) throw new Error("Catalog unavailable");
      var data = await response.json();
      initCatalog(data);
    } catch (err) {
      byId("rent-loading").textContent =
        "Unable to load rental options. Please refresh or try again later.";
    }
  }

  loadCatalog();
})();
