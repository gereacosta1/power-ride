import React, { useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getProductBySlug } from "../data/products.js";
import { usd } from "../utils/money.js";

export default function ProductDetails() {
  const { slug } = useParams();
  const product = useMemo(() => getProductBySlug(slug), [slug]);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  if (!product) {
    return (
      <div className="container" style={{ padding: 18 }}>
        <div className="card card-pad">
          <div style={{ fontWeight: 900 }}>Product not found</div>
          <div className="small" style={{ marginTop: 6 }}>
            The product you’re looking for doesn’t exist.
          </div>
          <div style={{ marginTop: 12 }}>
            <Link className="btn btn-primary" to="/catalog">Back to catalog</Link>
          </div>
        </div>
      </div>
    );
  }

  async function startAffirmCheckout() {
    setErr("");
    setBusy(true);
    try {
      // Minimal “server creates Affirm transaction” pattern.
      // You can extend later with shipping/address/metadata/cart.
      const res = await fetch("/api/affirm-authorize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: [
            {
              display_name: product.name,
              sku: product.id,
              unit_price: Math.round(product.price * 100),
              qty: 1
            }
          ],
          currency: "USD",
          shipping_amount: 0,
          tax_amount: 0,
          metadata: { product_slug: product.slug }
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Affirm authorize failed");

      // data.checkout_url should be returned by your function.
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
      <div style={{ display: "grid", gridTemplateColumns: "1.1fr .9fr", gap: 16, alignItems: "start" }}>
        <div className="card" style={{ overflow: "hidden" }}>
          <img
            src={product.image}
            alt={product.name}
            style={{ width: "100%", height: 420, objectFit: "cover", display: "block" }}
          />
        </div>

        <div className="card card-pad">
          <div className="h-eyebrow">Scooter</div>
          <h2 style={{ margin: "10px 0 6", letterSpacing: "-.02em" }}>{product.name}</h2>

          <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 10, flexWrap: "wrap" }}>
            <div style={{ fontSize: 22, fontWeight: 900 }}>{usd(product.price)}</div>
            <div className="small">
              As low as <span style={{ color: "var(--neon)" }}>${(product.price / 12).toFixed(2)}/mo</span> with Affirm (example)
            </div>
          </div>

          <p className="small" style={{ marginTop: 10 }}>{product.short}</p>

          <div style={{ marginTop: 10 }}>
            <div style={{ fontWeight: 800, marginBottom: 6 }}>Specs</div>
            <ul className="small" style={{ margin: 0, paddingLeft: 18 }}>
              {product.specs?.map((s) => <li key={s} style={{ marginBottom: 6 }}>{s}</li>)}
            </ul>
          </div>

          {err && (
            <div className="card" style={{ marginTop: 12, padding: 12, borderColor: "rgba(255,80,80,.35)" }}>
              <div style={{ fontWeight: 800 }}>Checkout error</div>
              <div className="small" style={{ marginTop: 6 }}>{err}</div>
            </div>
          )}

          <div style={{ display: "flex", gap: 10, marginTop: 14, flexWrap: "wrap" }}>
            <button className="btn btn-primary" onClick={startAffirmCheckout} disabled={busy}>
              {busy ? "Starting..." : "Checkout with Affirm"}
            </button>
            <Link className="btn" to="/catalog">Back</Link>
          </div>

          <div className="hr" />

          <div className="small">
            Rates from 0–36% APR. Subject to eligibility check. Options depend on purchase amount; down payment may be required.
            Full terms: affirm.com/disclosures.
          </div>
        </div>
      </div>
    </div>
  );
}
