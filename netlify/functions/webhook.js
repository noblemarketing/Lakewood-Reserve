"use strict";

const Stripe = require("stripe");

function jsonResponse(statusCode, body) {
  return {
    statusCode,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  };
}

function getRawBody(event) {
  if (!event.body) return "";
  if (event.isBase64Encoded) {
    return Buffer.from(event.body, "base64").toString("utf8");
  }
  return event.body;
}

/** Acknowledges Stripe events. Access codes are shown on /rent/success/ after payment. */
exports.handler = async function (event) {
  if (event.httpMethod !== "POST") {
    return jsonResponse(405, { error: "Method not allowed" });
  }

  const secretKey = process.env.STRIPE_SECRET_KEY;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!secretKey || !webhookSecret) {
    return jsonResponse(500, { error: "Webhook is not configured" });
  }

  const stripe = new Stripe(secretKey);
  const signature = event.headers["stripe-signature"] || event.headers["Stripe-Signature"];
  const rawBody = getRawBody(event);

  try {
    stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
  } catch (err) {
    console.error("Stripe webhook signature verification failed:", err.message);
    return jsonResponse(400, { error: "Invalid signature" });
  }

  return jsonResponse(200, { received: true });
};
