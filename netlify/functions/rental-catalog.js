"use strict";

const { getPublicCatalog } = require("./lib/rental-config");
const { getPublicWaiver } = require("./lib/rental-liability-waiver");
const { getCorsHeaders, handlePreflight } = require("./lib/cors");

exports.handler = async function (event) {
  const preflight = handlePreflight(event);
  if (preflight) return preflight;

  return {
    statusCode: 200,
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "public, max-age=60",
      ...getCorsHeaders(event),
    },
    body: JSON.stringify({
      ...getPublicCatalog(),
      liabilityWaiver: getPublicWaiver(),
    }),
  };
};
