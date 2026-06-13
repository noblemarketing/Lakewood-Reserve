"use strict";

const { getPublicCatalog } = require("./lib/rental-config");
const { getPublicWaiver } = require("./lib/rental-liability-waiver");

exports.handler = async function () {
  return {
    statusCode: 200,
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "public, max-age=60",
    },
    body: JSON.stringify({
      ...getPublicCatalog(),
      liabilityWaiver: getPublicWaiver(),
    }),
  };
};
