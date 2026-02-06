// netlify/functions/affirm-authorize.mjs
// Server-side only. Creates an Affirm checkout/transaction and returns a checkout_url.
//
// ENV in Netlify:
// - AFFIRM_PUBLIC_KEY   (optional depending on setup)
// - AFFIRM_PRIVATE_KEY  (or AFFIRM_PRIVATE_API_KEY)
// - AFFIRM_BASE_URL     (default: https://api.affirm.com/api/v2)
// - ALLOWED_ORIGINS     (optional CSV allowlist)

const BASE = String(process.env.AFFIRM_BASE_URL || "https://api.affirm.com/api/v2")
  .trim()
  .replace(/\/+$/, "");

const allowedOrigins = String(process.env.ALLOWED_ORIGINS || "")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);

function cors(origin) {
  const o = origin || "";
  const allow =
    allowedOrigins.length === 0 ? "*" : allowedOrigins.includes(o) ? o : allowedOrigins[0];
  return {
    "Access-Control-Allow-Origin": allow,
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization"
  };
}

function json(statusCode, body, headers = {}) {
  return {
    statusCode,
    headers: { "Content-Type": "application/json", ...headers },
    body: JSON.stringify(body)
  };
}

function getAuthHeader() {
  const priv =
    process.env.AFFIRM_PRIVATE_KEY ||
    process.env.AFFIRM_PRIVATE_API_KEY ||
    "";
  if (!priv) throw new Error("Missing AFFIRM_PRIVATE_KEY");
  // Many setups use Basic auth with the private key as username and blank password.
  // If your Riders project uses a different scheme, mirror that exactly here.
  const token = Buffer.from(`${priv}:`).toString("base64");
  return `Basic ${token}`;
}

export async function handler(event) {
  const origin = event.headers?.origin || event.headers?.Origin || "";
  const corsHeaders = cors(origin);

  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 204, headers: corsHeaders, body: "" };
  }

  if (event.httpMethod !== "POST") {
    return json(405, { error: "Method Not Allowed" }, corsHeaders);
  }

  try {
    const payload = JSON.parse(event.body || "{}");

    // Minimal validation
    const items = Array.isArray(payload.items) ? payload.items : [];
    if (items.length < 1) {
      return json(400, { error: "Missing items" }, corsHeaders);
    }

    // Example transaction body (you may need to align with your working Riders payload)
    const body = {
      merchant: {
        // Put real info later (name, website)
        user_confirmation_url: payload.user_confirmation_url || "https://example.com/confirm",
        user_cancel_url: payload.user_cancel_url || "https://example.com/cancel",
        user_confirmation_url_action: "POST"
      },
      items,
      currency: payload.currency || "USD",
      shipping_amount: Number(payload.shipping_amount || 0),
      tax_amount: Number(payload.tax_amount || 0),
      metadata: payload.metadata || {}
    };

    const res = await fetch(`${BASE}/transactions`, {
      method: "POST",
      headers: {
        Authorization: getAuthHeader(),
        "Content-Type": "application/json"
      },
      body: JSON.stringify(body)
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      return json(
        res.status,
        { error: data?.message || data?.error || "Affirm API error", details: data },
        corsHeaders
      );
    }

    // Many Affirm responses include a redirect/checkout URL. Adjust key based on actual response.
    const checkout_url =
      data?.checkout_url ||
      data?.redirect_url ||
      data?.redirect?.url ||
      "";

    if (!checkout_url) {
      return json(500, { error: "Affirm response missing checkout_url", details: data }, corsHeaders);
    }

    return json(200, { checkout_url }, corsHeaders);
  } catch (e) {
    return json(500, { error: String(e?.message || e) }, corsHeaders);
  }
}
