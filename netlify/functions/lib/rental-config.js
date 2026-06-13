"use strict";

/**
 * Single source of truth for equipment rental pricing and catalog.
 * Edit prices here (amounts in cents). SHED_CODE comes from env only — never put it in this file.
 */

const DURATIONS = [
  { id: "one_hour", label: "1 hour" },
  { id: "half_day", label: "Half day" },
  { id: "full_day", label: "Full day" },
];

/** Property and pricing catalog (amounts in cents). */
const PROPERTIES = [
  {
    id: "anchor-28",
    name: "Anchor Twenty Eight",
    equipment: {
      id: "kayaks",
      label: "Kayaks",
      maxQuantity: 4,
      // Prices in cents — change these as needed
      prices: {
        one_hour: 1500,
        half_day: 3500,
        full_day: 5500,
      },
    },
  },
  {
    id: "apex",
    name: "The Apex",
    equipment: {
      id: "paddle-boards",
      label: "Paddle Boards",
      maxQuantity: 4,
      prices: {
        one_hour: 2000,
        half_day: 4500,
        full_day: 7000,
      },
    },
  },
];

function getShedCode() {
  const code = process.env.SHED_CODE;
  if (!code || !String(code).trim()) {
    throw new Error("SHED_CODE environment variable is not configured");
  }
  return String(code).trim();
}

function getDurationLabel(durationId) {
  const match = DURATIONS.find(function (d) {
    return d.id === durationId;
  });
  return match ? match.label : durationId;
}

function getPropertyById(propertyId) {
  return PROPERTIES.find(function (p) {
    return p.id === propertyId;
  });
}

function getUnitPriceCents(propertyId, durationId) {
  const property = getPropertyById(propertyId);
  if (!property) return null;
  const price = property.equipment.prices[durationId];
  return typeof price === "number" ? price : null;
}

/** Public catalog for the rental page (no secrets). */
function getPublicCatalog() {
  return {
    durations: DURATIONS,
    properties: PROPERTIES.map(function (property) {
      return {
        id: property.id,
        name: property.name,
        equipment: {
          id: property.equipment.id,
          label: property.equipment.label,
          maxQuantity: property.equipment.maxQuantity,
          prices: { ...property.equipment.prices },
        },
      };
    }),
  };
}

module.exports = {
  DURATIONS,
  PROPERTIES,
  getShedCode,
  getDurationLabel,
  getPropertyById,
  getUnitPriceCents,
  getPublicCatalog,
};
