import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext.jsx";
import { usd } from "../utils/money.js";
import AffirmDisclosure from "../components/AffirmDisclosure.jsx";
import { supabase } from "../lib/supabase.js";

function loadPayPalSdk(clientId) {
  return new Promise((resolve, reject) => {
    if (!clientId) {
      reject(new Error("Missing PayPal client id"));
      return;
    }

    const existing = document.querySelector(
      `script[data-paypal-client-id="${clientId}"]`
    );

    if (existing) {
      if (window.paypal) {
        resolve(window.paypal);
        return;
      }

      existing.addEventListener("load", () => resolve(window.paypal));
      existing.addEventListener("error", () =>
        reject(new Error("Failed to load PayPal SDK"))
      );
      return;
    }

    const script = document.createElement("script");
    script.src = `https://www.paypal.com/sdk/js?client-id=${encodeURIComponent(
      clientId
    )}&components=hosted-buttons`;
    script.async = true;
    script.dataset.paypalClientId = clientId;

    script.onload = () => {
      if (window.paypal) resolve(window.paypal);
      else reject(new Error("PayPal SDK loaded but window.paypal is missing"));
    };

    script.onerror = () => reject(new Error("Failed to load PayPal SDK"));
    document.body.appendChild(script);
  });
}

export default function Cart() {
  const cart = useCart();
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  const [storeSettings, setStoreSettings] = useState({
    paypal_enabled: false,
    paypal_client_id: "",
    paypal_hosted_button_id: "",
    paypal_pay_later_enabled: true,
  });
  const [paypalReady, setPaypalReady] = useState(false);
  const [paypalError, setPaypalError] = useState("");
  const [paypalRenderedFor, setPaypalRenderedFor] = useState("");

  const lines = useMemo(() => cart.items, [cart.items]);

  useEffect(() => {
    loadStoreSettings();
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function renderPayPalButton() {
      const shouldShowPayPal =
        storeSettings.paypal_enabled &&
        storeSettings.paypal_client_id &&
        storeSettings.paypal_hosted_button_id &&
        lines.length > 0;

      if (!shouldShowPayPal) {
        setPaypalReady(false);
        setPaypalError("");
        return;
      }

      const renderKey = `${storeSettings.paypal_client_id}:${storeSettings.paypal_hosted_button_id}:cart`;
      if (paypalRenderedFor === renderKey) return;

      setPaypalError("");
      setPaypalReady(false);

      try {
        const paypal = await loadPayPalSdk(storeSettings.paypal_client_id);
        if (cancelled) return;

        const container = document.getElementById("paypal-cart-button-container");
        if (!container) return;

        container.innerHTML = "";

        if (!paypal?.HostedButtons) {
          throw new Error("PayPal Hosted Buttons is not available");
        }

        await paypal
          .HostedButtons({
            hostedButtonId: storeSettings.paypal_hosted_button_id,
          })
          .render("#paypal-cart-button-container");

        if (cancelled) return;
        setPaypalReady(true);
        setPaypalRenderedFor(renderKey);
      } catch (error) {
        console.error("PayPal render error:", error);
        if (!cancelled) {
          setPaypalError("PayPal could not be loaded right now.");
          setPaypalReady(false);
        }
      }
    }

    renderPayPalButton();

    return () => {
      cancelled = true;
    };
  }, [storeSettings, lines.length, paypalRenderedFor]);

  async function loadStoreSettings() {
    const { data, error } = await supabase
      .from("store_settings")
      .select("*")
      .limit(1)
      .single();

    if (error) {
      console.error("loadStoreSettings error:", error);
      return;
    }

    if (data) {
      setStoreSettings({
        paypal_enabled: Boolean(data.paypal_enabled),
        paypal_client_id: data.paypal_client_id || "",
        paypal_hosted_button_id: data.paypal_hosted_button_id || "",
        paypal_pay_later_enabled: Boolean(data.paypal_pay_later_enabled),
      });
    }
  }

  async function checkoutStripe() {
    setErr("");
    setBusy(true);

    try {
      if (!lines.length) throw new Error("Your cart is empty.");

      const res = await fetch("/api/create-stripe-checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: lines.map((it) => ({
            display_name: it.name,
            sku: it.id || it.slug,
            slug: it.slug,
            image: it.image,
            unit_price: Math.round(Number(it.price || 0) * 100),
            qty: Number(it.qty || 1),
          })),
          currency: "USD",
          metadata: { source: "cart" },
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Stripe checkout failed");

      if (data?.url) {
        window.location.href = data.url;
        return;
      }

      throw new Error("Missing Stripe checkout URL");
    } catch (e) {
      setErr(String(e?.message || e));
    } finally {
      setBusy(false);
    }
  }

  async function checkoutAffirm() {
    setErr("");
    setBusy(true);

    try {
      if (!lines.length) throw new Error("Your cart is empty.");

      const res = await fetch("/api/affirm-authorize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: lines.map((it) => ({
            display_name: it.name,
            sku: it.id || it.slug,
            unit_price: Math.round(Number(it.price || 0) * 100),
            qty: Number(it.qty || 1),
          })),
          currency: "USD",
          shipping_amount: Math.round(Number(cart.shipping || 0) * 100),
          tax_amount: Math.round(Number(cart.tax || 0) * 100),
          metadata: { source: "cart" },
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Affirm authorize failed");

      if (data?.checkout_url) {
        window.location.href = data.checkout_url;
        return;
      }

      throw new Error("Missing checkout_url from server");
    } catch (e) {
      setErr(String(e?.message || e));
    } finally {
      setBusy(false);
    }
  }

  const showPayPalBlock = Boolean(
    lines.length &&
      storeSettings.paypal_enabled &&
      storeSettings.paypal_client_id &&
      storeSettings.paypal_hosted_button_id
  );

  return (
    <div className="container" style={{ paddingTop: 18, paddingBottom: 18 }}>
      <div className="card card-pad">
        <div
          style={{
            display: "flex",
            alignItems: "baseline",
            justifyContent: "space-between",
            gap: 12,
            flexWrap: "wrap",
          }}
        >
          <div>
            <div className="h-eyebrow">Checkout</div>
            <h2 style={{ margin: "8px 0 0", letterSpacing: "-.02em" }}>Cart</h2>
            <div className="small" style={{ marginTop: 6 }}>
              {cart.count} item{cart.count === 1 ? "" : "s"}
            </div>
          </div>

          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <Link className="btn" to="/catalog">
              Continue shopping
            </Link>

            {!!cart.items.length && (
              <button className="btn" onClick={cart.clear} type="button">
                Clear cart
              </button>
            )}
          </div>
        </div>

        <div className="hr" />

        {!lines.length ? (
          <div className="small">
            Your cart is empty. <Link to="/catalog">Go to catalog</Link>
          </div>
        ) : (
          <div className="cart-grid">
            <div className="cart-items">
              {lines.map((it) => (
                <div key={it.slug} className="card cart-line">
                  <div className="cart-thumb">
                    <img src={it.image} alt={it.name} />
                  </div>

                  <div className="cart-line-body">
                    <div className="cart-line-top">
                      <div>
                        <div className="cart-line-title">{it.name}</div>
                        <div className="small" style={{ marginTop: 4 }}>
                          {usd(it.price)} each
                        </div>
                      </div>

                      <button
                        className="btn cart-remove"
                        onClick={() => cart.removeItem(it.slug)}
                        type="button"
                      >
                        Remove
                      </button>
                    </div>

                    <div className="cart-line-bottom">
                      <div className="cart-qty" aria-label="Quantity controls">
                        <button
                          className="btn"
                          onClick={() => cart.setQty(it.slug, Number(it.qty || 1) - 1)}
                          type="button"
                        >
                          −
                        </button>

                        <input
                          value={String(it.qty ?? 1)}
                          onChange={(e) => cart.setQty(it.slug, e.target.value)}
                          inputMode="numeric"
                          className="input"
                          aria-label="Quantity"
                          min="1"
                          step="1"
                        />

                        <button
                          className="btn"
                          onClick={() => cart.setQty(it.slug, Number(it.qty || 1) + 1)}
                          type="button"
                        >
                          +
                        </button>
                      </div>

                      <div style={{ fontWeight: 900 }}>
                        {usd(Number(it.price || 0) * Number(it.qty || 1))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="card card-pad cart-summary">
              <div style={{ fontWeight: 900, fontSize: 16 }}>Order summary</div>

              <div style={{ marginTop: 10, display: "grid", gap: 8 }}>
                <Row label="Subtotal" value={usd(cart.subtotal)} />
                <Row label="Shipping" value={usd(cart.shipping)} />
                <Row label="Estimated tax" value={usd(cart.tax)} />
                <div className="hr" />
                <Row label="Total" value={usd(cart.total)} strong />
              </div>

              {err && (
                <div
                  className="card"
                  style={{
                    marginTop: 12,
                    padding: 12,
                    borderColor: "rgba(255,80,80,.35)",
                  }}
                >
                  <div style={{ fontWeight: 800 }}>Checkout error</div>
                  <div className="small" style={{ marginTop: 6 }}>
                    {err}
                  </div>
                </div>
              )}

              {showPayPalBlock ? (
                <div
                  className="card"
                  style={{
                    marginTop: 14,
                    padding: 14,
                    background: "rgba(255,255,255,.04)",
                  }}
                >
                  <div style={{ fontWeight: 800 }}>PayPal</div>
                  <div className="small" style={{ marginTop: 6 }}>
                    {storeSettings.paypal_pay_later_enabled
                      ? "Pay with PayPal or use Pay Later."
                      : "Pay securely with PayPal."}
                  </div>

                  <div
                    id="paypal-cart-button-container"
                    style={{ marginTop: 12, minHeight: 44 }}
                  />

                  {!paypalReady && !paypalError ? (
                    <div className="small" style={{ marginTop: 8, opacity: 0.75 }}>
                      Loading PayPal...
                    </div>
                  ) : null}

                  {paypalError ? (
                    <div className="small" style={{ marginTop: 8, opacity: 0.85 }}>
                      {paypalError}
                    </div>
                  ) : null}
                </div>
              ) : null}

              <div style={{ display: "grid", gap: 10, marginTop: 14 }}>
                <button
                  className="btn btn-primary"
                  onClick={checkoutStripe}
                  disabled={busy}
                  type="button"
                >
                  {busy ? "Starting..." : "Checkout with Card / Klarna"}
                </button>

                <button
                  className="btn"
                  onClick={checkoutAffirm}
                  disabled={busy}
                  type="button"
                >
                  {busy ? "Starting..." : "Checkout with Affirm"}
                </button>

                <div className="small">
                  Prefer single product checkout? Use “View” from catalog.
                </div>
              </div>

              <div className="hr" />

              <AffirmDisclosure compact showExample={false} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function Row({ label, value, strong }) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        gap: 10,
        fontWeight: strong ? 900 : 600,
      }}
    >
      <div className="small" style={{ opacity: strong ? 1 : 0.85 }}>
        {label}
      </div>
      <div>{value}</div>
    </div>
  );
}