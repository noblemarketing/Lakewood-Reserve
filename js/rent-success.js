(function () {
  "use strict";

  function byId(id) {
    return document.getElementById(id);
  }

  function showError(message) {
    byId("rent-success-lead").hidden = true;
    byId("rent-success-access").hidden = true;
    var errorEl = byId("rent-success-error");
    errorEl.textContent = message;
    errorEl.hidden = false;
  }

  function showAccess(data) {
    byId("rent-success-lead").textContent = "Your payment was received. Use the code below to access your rental.";
    byId("rent-success-property").textContent =
      data.propertyName + " · " + data.equipmentLabel;
    byId("rent-access-code-label").textContent = data.codeLabel;
    byId("rent-access-code-value").textContent = data.accessCode;
    byId("rent-success-instructions").textContent = data.instructions;
    byId("rent-success-access").hidden = false;
  }

  async function loadAccessCode() {
    var params = new URLSearchParams(window.location.search);
    var sessionId = params.get("session_id");

    if (!sessionId) {
      showError(
        "We could not confirm your payment from this link. If you completed checkout, try again from the rental page or contact us for help."
      );
      return;
    }

    try {
      var response = await fetch(
        "/api/rental-session?session_id=" + encodeURIComponent(sessionId)
      );
      var data = await response.json();

      if (!response.ok || !data.accessCode) {
        throw new Error(data.error || "Unable to load access code");
      }

      showAccess(data);
    } catch (err) {
      showError(err.message || "Unable to load your access code. Please refresh or contact us.");
    }
  }

  loadAccessCode();
})();
