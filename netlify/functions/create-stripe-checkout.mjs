import Stripe from "stripe";

function json(statusCode, body) {
  return {
    statusCode,
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "no-store",
    },
    body: JSON.stringify(body),
  };
}

function getSiteBaseUrl(event) {
  const envUrl =
    process.env.SITE_URL ||
    process.env.URL ||
    process.env.DEPLOY_PRIME_URL ||
    "";

  if (envUrl) return String(envUrl).replace(/\/+$/, "");

  const proto = event.headers?.["x-forwarded-proto"] || "https";
  const host = event.headers?.host;
  if (!host) return "https://powerridellc.com";
  return `${proto}://${host}`;
}

function toAbsoluteImageUrl(image, siteBase) {
  const raw = String(image || "").trim();
  if (!raw) return "";

  if (raw.startsWith("http://") || raw.startsWith("https://")) return raw;
  if (raw.startsWith("/")) return `${siteBase}${raw}`;

  return `${siteBase}/${raw}`;
}

export async function handler(event) {
  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 204,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
      },
      body: "",
    };
  }

  if (event.httpMethod !== "POST") {
    return json(405, { error: "Method Not Allowed" });
  }

  try {
    const secretKey = process.env.STRIPE_SECRET_KEY;
    if (!secretKey) {
      return json(500, { error: "Missing STRIPE_SECRET_KEY" });
    }

    const stripe = new Stripe(secretKey);

    const payload = JSON.parse(event.body || "{}");
    const items = Array.isArray(payload.items) ? payload.items : [];

    if (!items.length) {
      return json(400, { error: "Missing items" });
    }

    const siteBase = getSiteBaseUrl(event);

    const successUrl = payload.success_url || `${siteBase}/cart?stripe=success`;
    const cancelUrl = payload.cancel_url || `${siteBase}/cart?stripe=cancel`;

    const line_items = items.map((it) => {
      const unitAmount = Math.round(Number(it.unit_price || 0));
      const quantity = Math.max(1, Number(it.qty || 1));
      const imageUrl = toAbsoluteImageUrl(it.image, siteBase);

      return {
        quantity,
        price_data: {
          currency: (payload.currency || "USD").toLowerCase(),
          product_data: {
            name: it.display_name || "Product",
            ...(imageUrl ? { images: [imageUrl] } : {}),
            metadata: {
              sku: it.sku || "",
              slug: it.slug || "",
            },
          },
          unit_amount: unitAmount,
        },
      };
    });

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items,
      success_url: successUrl,
      cancel_url: cancelUrl,
      billing_address_collection: "auto",
      phone_number_collection: { enabled: true },
      allow_promotion_codes: true,
      metadata: payload.metadata || {},
    });

    return json(200, {
      url: session.url,
      id: session.id,
    });
  } catch (e) {
    return json(500, {
      error: e?.message || "Stripe checkout failed",
    });
  }
}