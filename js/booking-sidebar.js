const bookingToggle = document.querySelector("#mobile-booking-toggle");
const bookingPanel = document.querySelector("#booking-panel");

if (bookingToggle && bookingPanel) {
  const syncState = () => {
    const expanded = document.body.classList.contains("booking-expanded");
    bookingToggle.setAttribute("aria-expanded", String(expanded));
    bookingToggle.textContent = expanded ? "Hide Availability" : "Check Availability";
  };

  bookingToggle.addEventListener("click", () => {
    document.body.classList.toggle("booking-expanded");
    syncState();
  });

  syncState();
}
