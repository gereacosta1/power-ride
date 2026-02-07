// src/pages/Cart.jsx
import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext.jsx";
import { usd } from "../utils/money.js";
import AffirmDisclosure from "../components/AffirmDisclosure.jsx";

export default function Cart() {
  const cart = useCart();
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  const lines = useMemo(() => cart.items, [cart.items]);

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
            {/* Items */}
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
                          onClick={() => cart.setQty(it.slug, (it.qty || 1) - 1)}
                          type="button"
                        >
                          −
                        </button>

                        <input
                          value={it.qty}
                          onChange={(e) => cart.setQty(it.slug, e.target.value)}
                          inputMode="numeric"
                          className="input"
                          aria-label="Quantity"
                        />

                        <button
                          className="btn"
                          onClick={() => cart.setQty(it.slug, (it.qty || 1) + 1)}
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

            {/* Summary */}
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

              <div style={{ display: "grid", gap: 10, marginTop: 14 }}>
                <button
                  className="btn btn-primary"
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

              {/* Keep compact styling, but the component now always includes the TILA example text */}
              <AffirmDisclosure compact id="affirm-terms-cart" />
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
