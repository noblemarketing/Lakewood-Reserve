"use strict";

const Stripe = require("stripe");
const {
  getPropertyById,
  getUnitPriceCents,
  getDurationLabel,
} = require("./lib/rental-config");
const { isValidWaiverAcceptance, WAIVER_VERSION } = require("./lib/rental-liability-waiver");
const { getCorsHeaders, handlePreflight } = require("./lib/cors");

function jsonResponse(statusCode, body, event) {
  return {
    statusCode,
    headers: {
      "Content-Type": "application/json",
      ...(event ? getCorsHeaders(event) : {}),
    },
    body: JSON.stringify(body),
  };
}

function getSiteUrl() {
  const configured = String(process.env.SITE_URL || "").trim().replace(/\/$/, "");
  const netlifyUrl = String(process.env.URL || "").trim().replace(/\/$/, "");
  const isLocalhost = /localhost|127\.0\.0\.1/i.test(configured);

  // On production deploys, ignore localhost SITE_URL so Stripe redirects stay on Netlify.
  if (configured && !(process.env.CONTEXT === "production" && isLocalhost)) {
    return configured;
  }
  if (netlifyUrl) {
    return netlifyUrl;
  }
  if (configured) {
    return configured;
  }
  throw new Error("SITE_URL environment variable is not configured");
}

function validateCartItem(item) {
  if (!item || typeof item !== "object") return null;

  const propertyId = String(item.propertyId || "").trim();
  const durationId = String(item.durationId || "").trim();
  const quantity = Number(item.quantity);

  if (!propertyId || !durationId || !Number.isInteger(quantity) || quantity < 1) {
    return null;
  }

  const property = getPropertyById(propertyId);
  if (!property) return null;

  if (quantity > property.equipment.maxQuantity) return null;

  const unitAmount = getUnitPriceCents(propertyId, durationId);
  if (unitAmount == null || unitAmount < 50) return null;

  return {
    propertyId,
    propertyName: property.name,
    equipmentId: property.equipment.id,
    equipmentLabel: property.equipment.label,
    durationId,
    durationLabel: getDurationLabel(durationId),
    quantity,
    unitAmount,
  };
}

exports.handler = async function (event) {
  const preflight = handlePreflight(event);
  if (preflight) return preflight;

  if (event.httpMethod !== "POST") {
    return jsonResponse(405, { error: "Method not allowed" }, event);
  }

  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey) {
    return jsonResponse(500, { error: "Payment service is not configured" }, event);
  }

  let payload;
  try {
    payload = JSON.parse(event.body || "{}");
  } catch (err) {
    return jsonResponse(400, { error: "Invalid JSON body" }, event);
  }

  const rawItems = Array.isArray(payload.items) ? payload.items : [];
  if (!rawItems.length) {
    return jsonResponse(400, { error: "Select at least one rental item" }, event);
  }

  if (!isValidWaiverAcceptance(payload)) {
    return jsonResponse(
      400,
      {
        error: "You must read and accept the equipment rental liability agreement before payment",
      },
      event
    );
  }

  const acceptedAt = new Date().toISOString();

  const validatedItems = [];
  for (let i = 0; i < rawItems.length; i += 1) {
    const valid = validateCartItem(rawItems[i]);
    if (!valid) {
      return jsonResponse(400, { error: "Invalid rental selection" }, event);
    }
    validatedItems.push(valid);
  }

  const propertyIds = validatedItems.map(function (item) {
    return item.propertyId;
  });
  if (new Set(propertyIds).size > 1) {
    return jsonResponse(400, { error: "All items must be for the same property" }, event);
  }

  const lineItems = validatedItems.map(function (item) {
    return {
      quantity: item.quantity,
      price_data: {
        currency: "usd",
        unit_amount: item.unitAmount,
        product_data: {
          name: item.propertyName + " — " + item.equipmentLabel + " (" + item.durationLabel + ")",
          description: "Equipment rental at Lakewood Reserve",
          metadata: {
            property_id: item.propertyId,
            equipment_id: item.equipmentId,
            duration_id: item.durationId,
          },
        },
      },
    };
  });

  const metadataCart = validatedItems.map(function (item) {
    return {
      property_id: item.propertyId,
      property_name: item.propertyName,
      equipment_id: item.equipmentId,
      equipment_label: item.equipmentLabel,
      duration_id: item.durationId,
      duration_label: item.durationLabel,
      quantity: String(item.quantity),
    };
  });

  let siteUrl;
  try {
    siteUrl = getSiteUrl();
  } catch (err) {
    return jsonResponse(500, { error: "Site URL is not configured" }, event);
  }

  const stripe = new Stripe(secretKey);

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: lineItems,
      success_url: siteUrl + "/rent/success/?session_id={CHECKOUT_SESSION_ID}",
      cancel_url: siteUrl + "/rent/",
      metadata: {
        cart: JSON.stringify(metadataCart),
        liability_waiver_accepted: "true",
        liability_waiver_version: WAIVER_VERSION,
        liability_waiver_accepted_at: acceptedAt,
      },
    });

    return jsonResponse(200, { url: session.url }, event);
  } catch (err) {
    console.error("Stripe checkout session error:", err.message);
    return jsonResponse(500, { error: "Unable to start checkout" }, event);
  }
};
