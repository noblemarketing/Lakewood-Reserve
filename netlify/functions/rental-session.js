"use strict";

const Stripe = require("stripe");
const { buildRentalAccessDetails } = require("./lib/rental-config");
const { getCorsHeaders, handlePreflight } = require("./lib/cors");

function jsonResponse(statusCode, body, event) {
  return {
    statusCode,
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "no-store",
      ...(event ? getCorsHeaders(event) : {}),
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
  const preflight = handlePreflight(event);
  if (preflight) return preflight;

  if (event.httpMethod !== "GET") {
    return jsonResponse(405, { error: "Method not allowed" }, event);
  }

  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey) {
    return jsonResponse(500, { error: "Payment service is not configured" }, event);
  }

  const sessionId = String(
    (event.queryStringParameters && event.queryStringParameters.session_id) || ""
  ).trim();

  if (!isValidSessionId(sessionId)) {
    return jsonResponse(400, { error: "Invalid session" }, event);
  }

  const stripe = new Stripe(secretKey);

  let session;
  try {
    session = await stripe.checkout.sessions.retrieve(sessionId);
  } catch (err) {
    console.error("Stripe session retrieve error:", err.message);
    return jsonResponse(404, { error: "Payment session not found" }, event);
  }

  if (session.payment_status !== "paid") {
    return jsonResponse(402, { error: "Payment not completed" }, event);
  }

  const cart = parseCartMetadata(session.metadata && session.metadata.cart);

  try {
    const access = buildRentalAccessDetails(cart);
    return jsonResponse(200, access, event);
  } catch (err) {
    console.error("Access code config error for session:", sessionId, err.message);
    var userMessage =
      "Your payment was received, but the access code is not set up yet. Please contact Lakewood Reserve for your code.";
    if (err.message.indexOf("KAYAK") !== -1) {
      userMessage =
        "Your payment was received, but the kayak lock code is not configured yet. Please contact Lakewood Reserve for your code.";
    } else if (err.message.indexOf("SHED") !== -1) {
      userMessage =
        "Your payment was received, but the shed code is not configured yet. Please contact Lakewood Reserve for your code.";
    }
    return jsonResponse(500, { error: userMessage, paid: true }, event);
  }
};
