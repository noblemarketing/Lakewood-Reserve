"use strict";

const Stripe = require("stripe");
const twilio = require("twilio");
const { getShedCode } = require("../../rental/rental-config");
const { hasHandled, markHandled } = require("../../rental/handled-sessions");

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

function parseCartMetadata(cartJson) {
  if (!cartJson) return [];
  try {
    const parsed = JSON.parse(cartJson);
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    return [];
  }
}

function buildPropertySummary(cart) {
  const names = [];
  const seen = {};
  cart.forEach(function (item) {
    const name = item.property_name || item.property_id;
    if (name && !seen[name]) {
      seen[name] = true;
      names.push(name);
    }
  });
  if (!names.length) return "Lakewood Reserve";
  if (names.length === 1) return names[0];
  if (names.length === 2) return names[0] + " and " + names[1];
  return names.slice(0, -1).join(", ") + ", and " + names[names.length - 1];
}

function buildSmsBody(propertySummary, shedCode) {
  return (
    "Thanks for renting from " +
    propertySummary +
    "! Shed code: " +
    shedCode +
    ". Please lock up when you're done."
  );
}

function normalizePhone(phone) {
  if (!phone) return "";
  return String(phone).trim();
}

async function sendRentalSms(toPhone, message) {
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const fromNumber = process.env.TWILIO_FROM_NUMBER;

  if (!accountSid || !authToken || !fromNumber) {
    throw new Error("Twilio environment variables are not configured");
  }

  const client = twilio(accountSid, authToken);
  await client.messages.create({
    to: toPhone,
    from: fromNumber,
    body: message,
  });
}

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

  let stripeEvent;
  try {
    stripeEvent = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
  } catch (err) {
    console.error("Stripe webhook signature verification failed:", err.message);
    return jsonResponse(400, { error: "Invalid signature" });
  }

  if (stripeEvent.type !== "checkout.session.completed") {
    return jsonResponse(200, { received: true });
  }

  const session = stripeEvent.data.object;

  if (session.payment_status !== "paid") {
    return jsonResponse(200, { received: true, skipped: "unpaid" });
  }

  if (hasHandled(session.id)) {
    return jsonResponse(200, { received: true, skipped: "duplicate" });
  }

  const phone =
    normalizePhone(session.customer_details && session.customer_details.phone) ||
    normalizePhone(session.customer_phone);

  if (!phone) {
    console.error("Checkout session completed without phone number:", session.id);
    return jsonResponse(200, { received: true, skipped: "no_phone" });
  }

  let shedCode;
  try {
    shedCode = getShedCode();
  } catch (err) {
    console.error("SHED_CODE missing for session:", session.id);
    return jsonResponse(500, { error: "Shed code not configured" });
  }

  const cart = parseCartMetadata(session.metadata && session.metadata.cart);
  const propertySummary = buildPropertySummary(cart);
  const smsBody = buildSmsBody(propertySummary, shedCode);

  try {
    await sendRentalSms(phone, smsBody);
    markHandled(session.id);
    console.log("Rental SMS sent for checkout session:", session.id);
    return jsonResponse(200, { received: true, sent: true });
  } catch (err) {
    console.error("Twilio SMS failed for session:", session.id, err.message);
    return jsonResponse(500, { error: "SMS delivery failed" });
  }
};
