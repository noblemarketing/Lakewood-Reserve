(function (global) {
  "use strict";

  var NETLIFY_API_ORIGIN = "https://lakewoodreserve.netlify.app";

  function buildApiUrls(path) {
    var urls = [path];
    var host = window.location.hostname;

    if (
      host !== "lakewoodreserve.netlify.app" &&
      host !== "localhost" &&
      host !== "127.0.0.1"
    ) {
      urls.push(NETLIFY_API_ORIGIN + path);
    }

    return urls;
  }

  async function fetchRentApi(path, options) {
    var urls = buildApiUrls(path);
    var lastError = null;

    for (var i = 0; i < urls.length; i += 1) {
      try {
        var response = await fetch(urls[i], options);
        var contentType = response.headers.get("content-type") || "";

        if (!contentType.includes("application/json")) {
          throw new Error("Invalid API response");
        }

        var data = await response.json();
        if (!response.ok) {
          throw new Error(data.error || "Request failed");
        }

        return data;
      } catch (err) {
        lastError = err;
      }
    }

    throw lastError || new Error("Request failed");
  }

  global.RentApi = {
    fetch: fetchRentApi,
  };
})(window);
