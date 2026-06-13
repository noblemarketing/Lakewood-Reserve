"use strict";

/**
 * Single source of truth for equipment rental pricing and catalog.
 * Edit prices here (amounts in cents). SHED_CODE comes from env only — never put it in this file.
 */

const DURATIONS = [{ id: "full_weekend", label: "Full weekend" }];

/** Property and pricing catalog (amounts in cents). */
const PROPERTIES = [
  {
    id: "anchor-28",
    name: "Anchor Twenty Eight",
    staySubtext: "Option to rent kayaks (2 available)",
    equipment: {
      id: "kayaks",
      label: "Kayaks",
      maxQuantity: 2,
      // Prices in cents — change these as needed
      prices: {
        full_weekend: 5000,
      },
    },
  },
  {
    id: "apex",
    name: "The Apex",
    staySubtext: "Option to rent paddle boards (2 available)",
    equipment: {
      id: "paddle-boards",
      label: "Paddle Boards",
      maxQuantity: 2,
      prices: {
        full_weekend: 5000,
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
        staySubtext: property.staySubtext,
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
