(() => {
  const form = document.querySelector("#hero-booking-form");
  if (!form) return;

  const arrival = form.querySelector("#hero-arrival");
  const departure = form.querySelector("#hero-departure");
  const today = new Date().toISOString().slice(0, 10);

  if (arrival) arrival.min = today;
  if (departure) departure.min = today;

  arrival?.addEventListener("change", () => {
    if (!departure || !arrival.value) return;
    departure.min = arrival.value;
    if (departure.value && departure.value <= arrival.value) departure.value = "";
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const a = arrival?.value ?? "";
    const d = departure?.value ?? "";
    const guests = form.querySelector("#hero-guests")?.value ?? "2";

    if (a && d && d <= a) {
      window.alert("Please choose a check-out date after check-in.");
      return;
    }

    const params = new URLSearchParams();
    if (a) params.set("arrival", a);
    if (d) params.set("departure", d);
    params.set("guests", guests);
    const qs = params.toString();
    window.location.href = qs ? `cabins.html?${qs}#availability` : "cabins.html#availability";
  });
})();
