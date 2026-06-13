"use strict";

const { getPublicCatalog } = require("../../rental/rental-config");

exports.handler = async function () {
  return {
    statusCode: 200,
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "public, max-age=60",
    },
    body: JSON.stringify(getPublicCatalog()),
  };
};
