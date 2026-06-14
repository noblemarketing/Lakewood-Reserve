"use strict";

const ALLOWED_ORIGINS = new Set([
  "https://lakewoodreserve.com",
  "https://www.lakewoodreserve.com",
  "http://localhost:8888",
  "http://127.0.0.1:8888",
]);

function isAllowedOrigin(origin) {
  if (!origin) return false;
  if (ALLOWED_ORIGINS.has(origin)) return true;
  return /^https:\/\/[a-z0-9-]+\.netlify\.app$/i.test(origin);
}

function getCorsHeaders(event) {
  const origin = String(
    (event.headers && (event.headers.origin || event.headers.Origin)) || ""
  ).trim();

  if (!isAllowedOrigin(origin)) {
    return {};
  }

  return {
    "Access-Control-Allow-Origin": origin,
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    Vary: "Origin",
  };
}

function handlePreflight(event) {
  if (event.httpMethod !== "OPTIONS") {
    return null;
  }

  return {
    statusCode: 204,
    headers: getCorsHeaders(event),
    body: "",
  };
}

module.exports = {
  getCorsHeaders,
  handlePreflight,
};
