"use strict";

/**
 * In-memory idempotency guard for Stripe webhook retries.
 * TODO: Replace with a durable store (Netlify Blobs, KV, or database) in production.
 */

const handledSessionIds = new Set();

function hasHandled(sessionId) {
  return handledSessionIds.has(sessionId);
}

function markHandled(sessionId) {
  handledSessionIds.add(sessionId);
}

module.exports = {
  hasHandled,
  markHandled,
};
