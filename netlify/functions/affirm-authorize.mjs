// netlify/functions/affirm-authorize.mjs
// Creates an Affirm transaction and returns a checkout_url.
//
// ENV in Netlify:
// - AFFIRM_PRIVATE_KEY (or AFFIRM_PRIVATE_API_KEY)
// - AFFIRM_BASE_URL (default: https://api.affirm.com/api/v2)
// - ALLOWED_ORIGINS (optional CSV allowlist)
// Optional nice-to-have:
// - SITE_URL (e.g. https://power-ride.netlify.app) override base URL for redirects

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
  const priv = process.env.AFFIRM_PRIVATE_KEY || process.env.AFFIRM_PRIVATE_API_KEY || "";
  if (!priv) throw new Error("Missing AFFIRM_PRIVATE_KEY");
  const token = Buffer.from(`${priv}:`).toString("base64");
  return `Basic ${token}`;
}

function getSiteBaseUrl(event) {
  // Prefer explicit SITE_URL if set
  const envUrl =
    process.env.SITE_URL ||
    process.env.URL || // Netlify production URL
    process.env.DEPLOY_PRIME_URL || // Netlify deploy preview URL
    "";

  if (envUrl) return String(envUrl).replace(/\/+$/, "");

  // Fallback: derive from request headers
  const proto = event.headers?.["x-forwarded-proto"] || "https";
  const host = event.headers?.host;
  if (!host) return "https://power-ride.netlify.app"; // last resort fallback
  return `${proto}://${host}`;
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

    const items = Array.isArray(payload.items) ? payload.items : [];
    if (items.length < 1) {
      return json(400, { error: "Missing items" }, corsHeaders);
    }

    const siteBase = getSiteBaseUrl(event);

    // Allow frontend to override confirmation/cancel, otherwise use your site.
    const confirmationUrl =
      payload.user_confirmation_url || `${siteBase}/legal?affirm=confirm`;
    const cancelUrl =
      payload.user_cancel_url || `${siteBase}/catalog?affirm=cancel`;

    const body = {
      merchant: {
        user_confirmation_url: confirmationUrl,
        user_cancel_url: cancelUrl,
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
        {
          error: data?.message || data?.error || "Affirm API error",
          details: data
        },
        corsHeaders
      );
    }

    const checkout_url = data?.checkout_url || data?.redirect_url || data?.redirect?.url || "";

    if (!checkout_url) {
      return json(
        500,
        { error: "Affirm response missing checkout_url", details: data },
        corsHeaders
      );
    }

    return json(200, { checkout_url }, corsHeaders);
  } catch (e) {
    return json(500, { error: String(e?.message || e) }, corsHeaders);
  }
}
