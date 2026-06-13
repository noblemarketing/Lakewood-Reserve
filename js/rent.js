(function () {
  "use strict";

  var PROPERTY_IMAGES = {
    "anchor-28": "/assets/images/cabins/anchor-twenty-eight-cover.png",
    apex: "/assets/images/cabins/the-apex-cover.png",
  };

  var catalog = null;
  var selectedPropertyId = null;
  var activeCard = null;

  function formatMoney(cents) {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(cents / 100);
  }

  function byId(id) {
    return document.getElementById(id);
  }

  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function getProperty(propertyId) {
    return catalog.properties.find(function (p) {
      return p.id === propertyId;
    });
  }

  function setActiveStep(step) {
    byId("rent-steps").querySelectorAll(".rent-steps__item").forEach(function (item) {
      item.classList.toggle("rent-steps__item--current", item.getAttribute("data-rent-step") === step);
    });
  }

  function renderStayOptions() {
    return catalog.properties
      .map(function (property) {
        var imageSrc =
          PROPERTY_IMAGES[property.id] || "/assets/images/cabins/the-apex-cover.png";
        var inputId = "rent-stay-" + property.id;
        return (
          '<label class="rent-stay-option" for="' +
          inputId +
          '">' +
          '<input type="radio" name="rent-stay" id="' +
          inputId +
          '" value="' +
          property.id +
          '" class="rent-stay-option__input">' +
          '<span class="rent-stay-option__card">' +
          '<span class="rent-stay-option__media">' +
          '<img src="' +
          imageSrc +
          '" alt="" width="1024" height="682" loading="lazy">' +
          "</span>" +
          '<span class="rent-stay-option__body">' +
          '<span class="rent-stay-option__name">' +
          escapeHtml(property.name) +
          "</span>" +
          '<span class="rent-stay-option__gear">Includes ' +
          escapeHtml(property.equipment.label.toLowerCase()) +
          "</span>" +
          "</span>" +
          "</span>" +
          "</label>"
        );
      })
      .join("");
  }

  function buildDurationOptions(property) {
    return catalog.durations
      .map(function (duration, index) {
        var price = property.equipment.prices[duration.id];
        var inputId = "rent-duration-" + property.id + "-" + duration.id;
        return (
          '<label class="rent-duration-option">' +
          '<input type="radio" name="rent-duration-' +
          property.id +
          '" id="' +
          inputId +
          '" value="' +
          duration.id +
          '" data-rent-duration' +
          (index === 0 ? " checked" : "") +
          ">" +
          '<span class="rent-duration-option__label">' +
          escapeHtml(duration.label) +
          "</span>" +
          '<span class="rent-duration-option__price">' +
          formatMoney(price) +
          " each</span>" +
          "</label>"
        );
      })
      .join("");
  }

  function renderEquipmentCard(property) {
    var imageSrc =
      PROPERTY_IMAGES[property.id] || "/assets/images/cabins/the-apex-cover.png";

    return (
      '<article class="rent-product-card" data-property-id="' +
      property.id +
      '">' +
      '<div class="rent-product-card__media">' +
      '<img src="' +
      imageSrc +
      '" alt="' +
      escapeHtml(property.equipment.label + " at " + property.name) +
      '" width="1024" height="682" loading="lazy">' +
      "</div>" +
      '<div class="rent-product-card__body">' +
      '<header class="rent-product-card__header">' +
      '<p class="rent-product-card__property">' +
      escapeHtml(property.name) +
      "</p>" +
      "<h2>" +
      escapeHtml(property.equipment.label) +
      "</h2>" +
      '<p class="rent-product-card__desc">Available for guests staying at ' +
      escapeHtml(property.name) +
      " only.</p>" +
      "</header>" +
      '<fieldset class="rent-duration-picker">' +
      '<legend class="rent-field-label">Rental duration</legend>' +
      '<div class="rent-duration-options">' +
      buildDurationOptions(property) +
      "</div>" +
      "</fieldset>" +
      '<div class="rent-qty-row">' +
      '<span class="rent-field-label" id="rent-qty-label-' +
      property.id +
      '">Quantity</span>' +
      '<div class="rent-qty-stepper" role="group" aria-labelledby="rent-qty-label-' +
      property.id +
      '">' +
      '<button type="button" class="rent-qty-btn" data-rent-qty-dec aria-label="Decrease quantity">−</button>' +
      '<span class="rent-qty-value" data-rent-qty-display aria-live="polite">0</span>' +
      '<button type="button" class="rent-qty-btn" data-rent-qty-inc aria-label="Increase quantity">+</button>' +
      '<input type="hidden" data-rent-qty value="0">' +
      "</div>" +
      "</div>" +
      '<p class="rent-line-total" data-rent-line-total hidden><span>Subtotal</span> <strong>$0.00</strong></p>' +
      "</div>" +
      "</article>"
    );
  }

  function getSelectedDurationId() {
    if (!activeCard) return "";
    var selected = activeCard.root.querySelector("[data-rent-duration]:checked");
    return selected ? selected.value : "";
  }

  function getQuantity() {
    if (!activeCard) return 0;
    return parseInt(activeCard.qtyInput.value, 10) || 0;
  }

  function setQuantity(nextQty, maxQuantity) {
    if (!activeCard) return 0;
    var qty = Math.max(0, Math.min(maxQuantity, nextQty));
    activeCard.qtyInput.value = String(qty);
    activeCard.qtyDisplay.textContent = String(qty);
    activeCard.decBtn.disabled = qty <= 0;
    activeCard.incBtn.disabled = qty >= maxQuantity;
    activeCard.root.classList.toggle("rent-product-card--selected", qty > 0);
    return qty;
  }

  function getLineTotal(property, qty, durationId) {
    if (!qty) return 0;
    var unit = property.equipment.prices[durationId];
    return unit ? unit * qty : 0;
  }

  function getDurationLabel(durationId) {
    var match = catalog.durations.find(function (d) {
      return d.id === durationId;
    });
    return match ? match.label : durationId;
  }

  function updateOrderLines(orderLines) {
    var listEl = byId("rent-order-lines");
    var emptyEl = byId("rent-order-empty");

    if (!selectedPropertyId) {
      emptyEl.textContent = "Choose your stay and add gear to continue.";
      listEl.hidden = true;
      listEl.innerHTML = "";
      emptyEl.hidden = false;
      return;
    }

    if (!orderLines.length) {
      emptyEl.textContent = "Add gear for your stay to continue.";
      listEl.hidden = true;
      listEl.innerHTML = "";
      emptyEl.hidden = false;
      return;
    }

    emptyEl.hidden = true;
    listEl.hidden = false;
    listEl.innerHTML = orderLines
      .map(function (line) {
        return (
          "<li>" +
          '<span class="rent-order-lines__item">' +
          "<strong>" +
          escapeHtml(line.propertyName) +
          "</strong> · " +
          escapeHtml(line.equipmentLabel) +
          "<br>" +
          escapeHtml(String(line.quantity)) +
          " × " +
          escapeHtml(line.durationLabel) +
          "</span>" +
          '<span class="rent-order-lines__price">' +
          formatMoney(line.total) +
          "</span>" +
          "</li>"
        );
      })
      .join("");
  }

  function updateTotals() {
    if (!catalog) return;

    var grandTotal = 0;
    var orderLines = [];

    if (selectedPropertyId && activeCard) {
      var property = getProperty(selectedPropertyId);
      var qty = getQuantity();
      var durationId = getSelectedDurationId();
      var lineTotal = getLineTotal(property, qty, durationId);

      if (qty > 0) {
        activeCard.lineTotalEl.hidden = false;
        activeCard.lineTotalEl.querySelector("strong").textContent = formatMoney(lineTotal);
        orderLines.push({
          propertyName: property.name,
          equipmentLabel: property.equipment.label,
          quantity: qty,
          durationLabel: getDurationLabel(durationId),
          total: lineTotal,
        });
        grandTotal = lineTotal;
      } else {
        activeCard.lineTotalEl.hidden = true;
      }
    }

    byId("rent-grand-total").textContent = formatMoney(grandTotal);
    byId("rent-now-btn").disabled = !selectedPropertyId || grandTotal <= 0;
    byId("rent-error").hidden = true;
    updateOrderLines(orderLines);
  }

  function bindEquipmentEvents(property) {
    var root = byId("rent-property-grid").querySelector('[data-property-id="' + property.id + '"]');
    activeCard = {
      root: root,
      qtyInput: root.querySelector("[data-rent-qty]"),
      qtyDisplay: root.querySelector("[data-rent-qty-display]"),
      decBtn: root.querySelector("[data-rent-qty-dec]"),
      incBtn: root.querySelector("[data-rent-qty-inc]"),
      lineTotalEl: root.querySelector("[data-rent-line-total]"),
    };

    var maxQty = property.equipment.maxQuantity;
    setQuantity(0, maxQty);

    activeCard.decBtn.addEventListener("click", function () {
      setQuantity(getQuantity() - 1, maxQty);
      updateTotals();
    });

    activeCard.incBtn.addEventListener("click", function () {
      setQuantity(getQuantity() + 1, maxQty);
      updateTotals();
    });

    root.querySelectorAll("[data-rent-duration]").forEach(function (input) {
      input.addEventListener("change", updateTotals);
    });
  }

  function showEquipmentSection(propertyId) {
    var property = getProperty(propertyId);
    if (!property) return;

    selectedPropertyId = propertyId;
    byId("rent-stay-form").hidden = true;
    byId("rent-equipment-section").hidden = false;
    byId("rent-selected-stay-name").textContent = property.name;
    byId("rent-property-grid").innerHTML = renderEquipmentCard(property);
    bindEquipmentEvents(property);
    setActiveStep("gear");
    updateTotals();
  }

  function resetToStaySelection() {
    selectedPropertyId = null;
    activeCard = null;
    byId("rent-equipment-section").hidden = true;
    byId("rent-property-grid").innerHTML = "";
    byId("rent-stay-form").hidden = false;
    byId("rent-stay-form").querySelectorAll('input[name="rent-stay"]').forEach(function (input) {
      input.checked = false;
    });
    byId("rent-stay-continue").disabled = true;
    setActiveStep("stay");
    updateTotals();
  }

  function bindStayForm() {
    var form = byId("rent-stay-form");
    var continueBtn = byId("rent-stay-continue");

    form.addEventListener("change", function (e) {
      if (e.target.name === "rent-stay") {
        continueBtn.disabled = false;
      }
    });

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var selected = form.querySelector('input[name="rent-stay"]:checked');
      if (!selected) return;
      showEquipmentSection(selected.value);
    });

    byId("rent-change-stay").addEventListener("click", resetToStaySelection);
    byId("rent-now-btn").addEventListener("click", startCheckout);
  }

  function collectItems() {
    if (!selectedPropertyId || !activeCard) return [];
    var qty = getQuantity();
    if (qty < 1) return [];
    return [
      {
        propertyId: selectedPropertyId,
        durationId: getSelectedDurationId(),
        quantity: qty,
      },
    ];
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
    setActiveStep("pay");

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
      btn.textContent = "Continue to payment";
      setActiveStep("gear");
      updateTotals();
    }
  }

  function initCatalog(data) {
    catalog = data;
    byId("rent-stay-options").innerHTML = renderStayOptions();
    byId("rent-loading").hidden = true;
    byId("rent-stay-form").hidden = false;
    byId("rent-summary").hidden = false;
    bindStayForm();
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
