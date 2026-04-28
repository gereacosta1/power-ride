// netlify/functions/affirm-authorize.mjs
// Creates an Affirm checkout and returns a checkout_url.
//
// ENV in Netlify:
// - AFFIRM_PUBLIC_KEY (or AFFIRM_PUBLIC_API_KEY)
// - AFFIRM_PRIVATE_KEY (or AFFIRM_PRIVATE_API_KEY)
// - AFFIRM_BASE_URL (default: https://api.affirm.com/api/v2)
// - ALLOWED_ORIGINS (optional CSV allowlist)
// Optional:
// - SITE_URL (e.g. https://powerridellc.com)

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
    headers: {
      "Content-Type": "application/json",
      ...headers
    },
    body: JSON.stringify(body)
  };
}

function getAuthHeader() {
  const pub =
    process.env.AFFIRM_PUBLIC_KEY ||
    process.env.AFFIRM_PUBLIC_API_KEY ||
    "";

  const priv =
    process.env.AFFIRM_PRIVATE_KEY ||
    process.env.AFFIRM_PRIVATE_API_KEY ||
    "";

  if (!pub) {
    throw new Error("Missing AFFIRM_PUBLIC_KEY");
  }

  if (!priv) {
    throw new Error("Missing AFFIRM_PRIVATE_KEY");
  }

  const token = Buffer.from(`${pub}:${priv}`).toString("base64");
  return `Basic ${token}`;
}

function getSiteBaseUrl(event) {
  const envUrl =
    process.env.SITE_URL ||
    process.env.URL ||
    process.env.DEPLOY_PRIME_URL ||
    "";

  if (envUrl) {
    return String(envUrl).replace(/\/+$/, "");
  }

  const proto = event.headers?.["x-forwarded-proto"] || "https";
  const host = event.headers?.host;

  if (!host) {
    return "https://powerridellc.com";
  }

  return `${proto}://${host}`;
}

function toAmount(value) {
  const n = Number(value || 0);
  if (!Number.isFinite(n) || n < 0) return 0;
  return Math.round(n);
}

function normalizeItems(items) {
  return items.map((item, index) => {
    const qty = Math.max(1, Number(item.qty || 1));
    const unitPrice = toAmount(item.unit_price);

    if (!unitPrice) {
      throw new Error(`Invalid unit_price for item at index ${index}`);
    }

    return {
      display_name: String(item.display_name || item.name || `Product ${index + 1}`),
      sku: String(item.sku || item.slug || `item-${index + 1}`),
      unit_price: unitPrice,
      qty
    };
  });
}

export async function handler(event) {
  const origin = event.headers?.origin || event.headers?.Origin || "";
  const corsHeaders = cors(origin);

  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 204,
      headers: corsHeaders,
      body: ""
    };
  }

  if (event.httpMethod !== "POST") {
    return json(405, { error: "Method Not Allowed" }, corsHeaders);
  }

  try {
    const payload = JSON.parse(event.body || "{}");
    const rawItems = Array.isArray(payload.items) ? payload.items : [];

    if (rawItems.length < 1) {
      return json(400, { error: "Missing items" }, corsHeaders);
    }

    const items = normalizeItems(rawItems);
    const siteBase = getSiteBaseUrl(event);

    const confirmationUrl =
      payload.user_confirmation_url || `${siteBase}/legal?affirm=confirm`;

    const cancelUrl =
      payload.user_cancel_url || `${siteBase}/cart?affirm=cancel`;

    const shippingAmount = toAmount(payload.shipping_amount);
    const taxAmount = toAmount(payload.tax_amount);
    const currency = String(payload.currency || "USD").toUpperCase();

    const itemsTotal = items.reduce(
      (sum, item) => sum + item.unit_price * item.qty,
      0
    );

    const total = itemsTotal + shippingAmount + taxAmount;

    if (total < 5000) {
      return json(
        400,
        { error: "Affirm requires a minimum order total of $50.00" },
        corsHeaders
      );
    }

    const body = {
      merchant: {
        user_confirmation_url: confirmationUrl,
        user_cancel_url: cancelUrl,
        user_confirmation_url_action: "GET"
      },
      shipping: {
        name: {
          first: String(payload.shipping_first_name || "Customer"),
          last: String(payload.shipping_last_name || "Customer")
        },
        address: {
          line1: String(payload.shipping_line1 || "123 Main St"),
          line2: String(payload.shipping_line2 || ""),
          city: String(payload.shipping_city || "Miami"),
          state: String(payload.shipping_state || "FL"),
          zipcode: String(payload.shipping_zipcode || "33101"),
          country: String(payload.shipping_country || "USA")
        },
        phone_number: String(payload.shipping_phone_number || "3055555555"),
        email: String(payload.shipping_email || "customer@example.com")
      },
      billing: {
        name: {
          first: String(payload.billing_first_name || payload.shipping_first_name || "Customer"),
          last: String(payload.billing_last_name || payload.shipping_last_name || "Customer")
        },
        address: {
          line1: String(payload.billing_line1 || payload.shipping_line1 || "123 Main St"),
          line2: String(payload.billing_line2 || payload.shipping_line2 || ""),
          city: String(payload.billing_city || payload.shipping_city || "Miami"),
          state: String(payload.billing_state || payload.shipping_state || "FL"),
          zipcode: String(payload.billing_zipcode || payload.shipping_zipcode || "33101"),
          country: String(payload.billing_country || payload.shipping_country || "USA")
        },
        phone_number: String(
          payload.billing_phone_number || payload.shipping_phone_number || "3055555555"
        ),
        email: String(payload.billing_email || payload.shipping_email || "customer@example.com")
      },
      items,
      discounts: {},
      metadata: {
        mode: "modal",
        source: "cart",
        ...(payload.metadata || {})
      },
      order_id: String(
        payload.order_id || `order_${Date.now()}`
      ),
      shipping_amount: shippingAmount,
      tax_amount: taxAmount,
      total,
      currency
    };

    const res = await fetch(`${BASE}/checkout/direct`, {
      method: "POST",
      headers: {
        Authorization: getAuthHeader(),
        "Content-Type": "application/json"
      },
      body: JSON.stringify(body)
    });

    const text = await res.text();
    let data = {};

    try {
      data = text ? JSON.parse(text) : {};
    } catch {
      data = { raw: text };
    }

    if (!res.ok) {
      console.error("Affirm API error:", {
        status: res.status,
        statusText: res.statusText,
        data
      });

      return json(
        res.status,
        {
          error: data?.message || data?.error || "Affirm API error",
          details: data
        },
        corsHeaders
      );
    }

    const checkoutUrl =
      data?.checkout_url ||
      data?.redirect_url ||
      data?.redirect?.url ||
      "";

    if (!checkoutUrl) {
      return json(
        500,
        {
          error: "Affirm response missing checkout_url",
          details: data
        },
        corsHeaders
      );
    }

    return json(200, { checkout_url: checkoutUrl }, corsHeaders);
  } catch (e) {
    console.error("affirm-authorize function error:", e);

    return json(
      500,
      {
        error: String(e?.message || e)
      },
      corsHeaders
    );
  }
}