"use strict";

const Stripe = require("stripe");
const { buildRentalAccessDetails } = require("./lib/rental-config");

function jsonResponse(statusCode, body, extraHeaders) {
  return {
    statusCode,
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "no-store",
      ...(extraHeaders || {}),
    },
    body: JSON.stringify(body),
  };
}

function parseCartMetadata(cartJson) {
  if (!cartJson) return [];
  try {
    const parsed = JSON.parse(cartJson);
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    return [];
  }
}

function isValidSessionId(sessionId) {
  return /^cs_(test|live)_[A-Za-z0-9]+$/.test(sessionId);
}

exports.handler = async function (event) {
  if (event.httpMethod !== "GET") {
    return jsonResponse(405, { error: "Method not allowed" });
  }

  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey) {
    return jsonResponse(500, { error: "Payment service is not configured" });
  }

  const sessionId = String(
    (event.queryStringParameters && event.queryStringParameters.session_id) || ""
  ).trim();

  if (!isValidSessionId(sessionId)) {
    return jsonResponse(400, { error: "Invalid session" });
  }

  const stripe = new Stripe(secretKey);

  let session;
  try {
    session = await stripe.checkout.sessions.retrieve(sessionId);
  } catch (err) {
    console.error("Stripe session retrieve error:", err.message);
    return jsonResponse(404, { error: "Payment session not found" });
  }

  if (session.payment_status !== "paid") {
    return jsonResponse(402, { error: "Payment not completed" });
  }

  const cart = parseCartMetadata(session.metadata && session.metadata.cart);

  try {
    const access = buildRentalAccessDetails(cart);
    return jsonResponse(200, access);
  } catch (err) {
    console.error("Access code config error for session:", sessionId, err.message);
    return jsonResponse(500, { error: "Access code not configured" });
  }
};
